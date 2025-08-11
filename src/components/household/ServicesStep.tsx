import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { MapPin, Heart, GraduationCap, Shield, ShoppingCart, Navigation } from 'lucide-react'
import { HouseholdFormData } from '../../lib/schemas'
import FormInput from '../forms/FormInput'
import FormSelect from '../forms/FormSelect'

interface ServicesStepProps {
  register: UseFormRegister<HouseholdFormData>
  errors: FieldErrors<HouseholdFormData>
}

const ServicesStep: React.FC<ServicesStepProps> = ({
  register,
  errors
}) => {
  const roadConditionOptions = [
    { value: 'good_all_year', label: 'Good All Year Round' },
    { value: 'good_dry_only', label: 'Good During Dry Season Only' },
    { value: 'poor_all_year', label: 'Poor All Year Round' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Access to Services
        </h2>
        <p className="text-sm text-gray-500">
          Information about access to essential services and infrastructure.
        </p>
      </div>

      {/* Service Travel Times */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900 mb-3">
          Travel Time to Nearest Services (in minutes)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Heart className="h-5 w-5 text-red-500 flex-shrink-0" />
            <FormInput
              label="Health Post/Clinic"
              type="number"
              registration={register('services_health_mins', { valueAsNumber: true })}
              error={errors.services_health_mins?.message}
              placeholder="Minutes to health facility"
            />
          </div>

          <div className="flex items-center space-x-3">
            <GraduationCap className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <FormInput
              label="Primary School"
              type="number"
              registration={register('services_school_mins', { valueAsNumber: true })}
              error={errors.services_school_mins?.message}
              placeholder="Minutes to school"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-purple-500 flex-shrink-0" />
            <FormInput
              label="Police Station"
              type="number"
              registration={register('services_police_mins', { valueAsNumber: true })}
              error={errors.services_police_mins?.message}
              placeholder="Minutes to police"
            />
          </div>

          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-5 w-5 text-green-500 flex-shrink-0" />
            <FormInput
              label="Market/Store"
              type="number"
              registration={register('services_market_mins', { valueAsNumber: true })}
              error={errors.services_market_mins?.message}
              placeholder="Minutes to market"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Travel Time Guidelines:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use the most common mode of transportation from this household</li>
            <li>• Consider average travel time during good weather</li>
            <li>• Include walking time if walking is part of the journey</li>
            <li>• Enter 0 if the service is in the same village/area</li>
          </ul>
        </div>
      </div>

      {/* Road Conditions */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center space-x-2 mb-3">
          <Navigation className="h-4 w-4 text-gray-600" />
          <h3 className="text-md font-medium text-gray-900">Road Infrastructure</h3>
        </div>

        <FormSelect
          label="Road Condition to Nearest Town"
          options={roadConditionOptions}
          registration={register('road_condition')}
          error={errors.road_condition?.message}
          required
          placeholder="Select road condition"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Road Condition Definitions:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Good All Year:</strong> Passable by vehicles in all weather</li>
            <li>• <strong>Good Dry Season Only:</strong> Vehicles can pass when dry, difficult when wet</li>
            <li>• <strong>Poor All Year:</strong> Difficult for vehicles even in good weather</li>
          </ul>
        </div>
      </div>

      {/* Service Access Impact */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800 mb-2">Why Service Access Matters:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>Health:</strong> Quick access to healthcare saves lives</li>
          <li>• <strong>Education:</strong> Nearby schools improve enrollment and attendance</li>
          <li>• <strong>Security:</strong> Police access enhances community safety</li>
          <li>• <strong>Economic:</strong> Market access improves income opportunities</li>
          <li>• <strong>Infrastructure:</strong> Good roads enable service delivery</li>
        </ul>
      </div>

      {/* Additional Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Consider These Factors:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Does the household use different services during emergencies?</li>
          <li>• Are there seasonal variations in access?</li>
          <li>• What is the most reliable means of transportation?</li>
          <li>• Are there cost barriers to accessing these services?</li>
        </ul>
      </div>
    </div>
  )
}

export default ServicesStep
