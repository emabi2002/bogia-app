import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { db, type LocalProfile, getCurrentTimestamp, getCurrentTimestampMs } from '../lib/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: LocalProfile | null
  loading: boolean
  signInWithOTP: (email: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<LocalProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<LocalProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      // Try to get profile from local DB first
      let localProfile = await db.profiles.get(userId)

      if (!localProfile) {
        // If not found locally, try to fetch from Supabase
        const { data: remoteProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
          return
        }

        if (remoteProfile) {
          // Save remote profile to local DB
          localProfile = {
            ...remoteProfile,
            sync_status: 'synced' as const,
            last_modified: getCurrentTimestampMs()
          }
          await db.profiles.put(localProfile)
        } else {
          // Create new profile if none exists
          localProfile = {
            id: userId,
            role: 'enumerator',
            created_at: getCurrentTimestamp(),
            sync_status: 'pending' as const,
            last_modified: getCurrentTimestampMs()
          }
          await db.profiles.put(localProfile)

          // Try to sync to Supabase
          try {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                role: 'enumerator'
              })

            if (!insertError) {
              await db.profiles.update(userId, { sync_status: 'synced' })
              localProfile.sync_status = 'synced'
            }
          } catch (error) {
            console.error('Error creating remote profile:', error)
          }
        }
      }

      if (localProfile) {
        setProfile(localProfile)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const signInWithOTP = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<LocalProfile>) => {
    if (!user || !profile) {
      throw new Error('No user logged in')
    }

    const updatedProfile = {
      ...profile,
      ...updates,
      last_modified: getCurrentTimestampMs(),
      sync_status: 'pending' as const
    }

    // Update local DB
    await db.profiles.put(updatedProfile)
    setProfile(updatedProfile)

    // Try to sync to Supabase
    try {
      const { sync_status, last_modified, ...profileData } = updatedProfile
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData)

      if (!error) {
        await db.profiles.update(user.id, { sync_status: 'synced' })
        setProfile(prev => prev ? { ...prev, sync_status: 'synced' } : null)
      }
    } catch (error) {
      console.error('Error syncing profile:', error)
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithOTP,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
