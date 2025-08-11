import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Camera,
  Plus,
  Minus,
  Save
} from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'
import { syncService } from '../lib/sync'
import FormInput from '../components/forms/FormInput'
import FormSelect from '../components/forms/FormSelect'
import FormCheckbox from '../components/forms/FormCheckbox'

// Simplified form data types
interface IndividualFormData {
  name_or_initials: string
  sex: 'male' | 'female'
  relationship: string
  age_years?: number
  dob?: string
  marital_status?: string
  in_school?: boolean
  grade_current?: string
  highest_level?: string
  livelihood?: string
  disability_seeing: string
  disability_hearing: string
  disability_walking: string
  disability_remembering: string
  disability_selfcare: string
  disability_communication: string
  youth_15_35?: boolean
  skills?: string[]
  availability?: string
  training_need?: string
}

interface HouseholdFormData {
  // Location
  province: string
  district: string
  llg: string
  ward: string
  hamlet?: string
  gps_lat?: number
  gps_lng?: number
  gps_accuracy?: number

  // Household head
  head_name: string
  head_phone?: string
  tenure: string

  // WASH
  water_source: string
  sanitation: string
  handwashing_soap: boolean

  // Energy/ICT
  energy_lighting: string
  energy_cooking: string
  mobile_coverage: string
  internet_access: string
  smartphones_count?: number

  // Services
  services_health_mins?: number
  services_school_mins?: number
  services_police_mins?: number
  services_market_mins?: number
  road_condition: string

  // Consent
  consent: boolean
  enumerator_id?: string

  // Individuals
  individuals: IndividualFormData[]
}

const steps = [
  { id: 'location', title: 'Location' },
  { id: 'household-head', title: 'Household Head' },
  { id: 'roster', title: 'Household Roster' },
  { id: 'wash', title: 'WASH' },
  { id: 'energy-ict', title: 'Energy & ICT' },
  { id: 'services', title: 'Services' },
  { id: 'review', title: 'Review' }
]

const HouseholdForm: React.FC = () => {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [gpsData, setGpsData] = useState<{
    lat: number
    lng: number
    accuracy: number
  } | null>(null)
  const [capturedPhotos, setCapturedPhotos] = useState<File[]>([])

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<HouseholdFormData>({
    mode: 'onBlur',
    defaultValues: {
      individuals: [
        {
          name_or_initials: '',
          sex: 'male',
          relationship: 'head',
          disability_seeing: 'none',
          disability_hearing: 'none',
          disability_walking: 'none',
          disability_remembering: 'none',
          disability_selfcare: 'none',
          disability_communication: 'none'
        }
      ],
      consent: false,
      enumerator_id: profile?.id
    }
  })

  const { fields: individualFields, append: appendIndividual, remove: removeIndividual } = useFieldArray({
    control,
    name: 'individuals'
  })

  // GPS capture
  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gps = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        setGpsData(gps)
        setValue('gps_lat', gps.lat)
        setValue('gps_lng', gps.lng)
        setValue('gps_accuracy', gps.accuracy)
      },
      (error) => {
        console.error('GPS error:', error)
        alert('Failed to get GPS coordinates. Please try again.')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  // Photo capture
  const capturePhoto = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setCapturedPhotos(prev => [...prev, file])
      }
    }

    input.click()
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: HouseholdFormData) => {
    setSaving(true)

    try {
      // Convert photos to proper format
      const photoData = capturedPhotos.map(file => ({
        url: URL.createObjectURL(file), // Temporary URL
        blob_data: file,
        caption: 'Household photo'
      }))

      await syncService.saveHousehold(data, data.individuals, photoData)

      alert('Household data saved successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving household:', error)
      alert('Failed to save household data. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Simple step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Province"
                registration={register('province', { required: 'Province is required' })}
                error={errors.province?.message}
                required
              />
              <FormInput
                label="District"
                registration={register('district', { required: 'District is required' })}
                error={errors.district?.message}
                required
              />
              <FormInput
                label="LLG"
                registration={register('llg', { required: 'LLG is required' })}
                error={errors.llg?.message}
                required
              />
              <FormInput
                label="Ward"
                registration={register('ward', { required: 'Ward is required' })}
                error={errors.ward?.message}
                required
              />
            </div>
            <button
              type="button"
              onClick={captureGPS}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {gpsData ? 'GPS Captured' : 'Capture GPS'}
            </button>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Household Head</h3>
            <FormInput
              label="Household Head Name"
              registration={register('head_name', { required: 'Name is required' })}
              error={errors.head_name?.message}
              required
            />
            <FormInput
              label="Phone Number"
              registration={register('head_phone')}
              error={errors.head_phone?.message}
            />
            <FormSelect
              label="Land Tenure"
              options={[
                { value: 'owned', label: 'Owned' },
                { value: 'rented', label: 'Rented' },
                { value: 'borrowed', label: 'Borrowed' },
                { value: 'other', label: 'Other' }
              ]}
              registration={register('tenure', { required: 'Tenure is required' })}
              error={errors.tenure?.message}
              required
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Household Members</h3>
            {individualFields.map((individual, index) => (
              <div key={individual.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Member {index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeIndividual(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Name"
                    registration={register(`individuals.${index}.name_or_initials`, { required: 'Name is required' })}
                    error={errors.individuals?.[index]?.name_or_initials?.message}
                    required
                  />
                  <FormSelect
                    label="Sex"
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' }
                    ]}
                    registration={register(`individuals.${index}.sex`, { required: 'Sex is required' })}
                    error={errors.individuals?.[index]?.sex?.message}
                    required
                  />
                  <FormInput
                    label="Age"
                    type="number"
                    registration={register(`individuals.${index}.age_years`, { valueAsNumber: true })}
                    error={errors.individuals?.[index]?.age_years?.message}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendIndividual({
                name_or_initials: '',
                sex: 'male',
                relationship: 'child',
                disability_seeing: 'none',
                disability_hearing: 'none',
                disability_walking: 'none',
                disability_remembering: 'none',
                disability_selfcare: 'none',
                disability_communication: 'none'
              })}
              className="w-full flex items-center justify-center px-4 py-3 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </button>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Review & Submit</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Location:</strong> {getValues('ward')}, {getValues('llg')}</p>
              <p><strong>Household Head:</strong> {getValues('head_name')}</p>
              <p><strong>Members:</strong> {individualFields.length}</p>
              <p><strong>Photos:</strong> {capturedPhotos.length}</p>
            </div>
            <button
              type="button"
              onClick={capturePhoto}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Camera className="h-4 w-4 mr-2" />
              {capturedPhotos.length > 0 ? 'Add Photo' : 'Take Photo'}
            </button>
            <FormCheckbox
              label="I consent to data collection"
              registration={register('consent', { required: 'Consent is required' })}
              error={errors.consent?.message}
              required
            />
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Step {currentStep + 1}</h3>
            <p>This step is being implemented...</p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Household Survey</h1>
          <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-2 min-w-0">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStep
                  ? 'bg-green-100 text-green-600'
                  : index === currentStep
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`text-sm font-medium truncate ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px ${
                  index < currentStep ? 'bg-green-300' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {renderStepContent()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Household'}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default HouseholdForm
