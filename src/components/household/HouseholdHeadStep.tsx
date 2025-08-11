import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { User, Phone, Home } from 'lucide-react'
import { HouseholdFormData } from '../../lib/schemas'
import FormInput from '../forms/FormInput'
import FormSelect from '../forms/FormSelect'

interface HouseholdHeadStepProps {
  register: UseFormRegister<HouseholdFormData>
  errors: FieldErrors<HouseholdFormData>
}

const HouseholdHeadStep: React.FC<HouseholdHeadStepProps> = ({
  register,
  errors
}) => {
  const tenureOptions = [
    { value: 'owned', label: 'Owned' },
    { value: 'rented', label: 'Rented' },
    { value: 'borrowed', label: 'Borrowed' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Household Head Information
        </h2>
        <p className="text-sm text-gray-500">
          Please provide details about the household head and land tenure.
        </p>
      </div>

      {/* Household head details */}
      <div className="space-y-4">
        <FormInput
          label="Household Head Name"
          registration={register('head_name')}
          error={errors.head_name?.message}
          required
          placeholder="Enter full name of household head"
        />

        <FormInput
          label="Household Head Phone Number"
          type="tel"
          registration={register('head_phone')}
          error={errors.head_phone?.message}
          placeholder="Enter phone number (optional)"
        />

        <FormSelect
          label="Land Tenure"
          options={tenureOptions}
          registration={register('tenure')}
          error={errors.tenure?.message}
          required
          placeholder="How is this land held?"
        />
      </div>

      {/* Information boxes */}
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            About Household Head:
          </h4>
          <p className="text-sm text-yellow-700">
            The household head is typically the person who makes major decisions
            for the household or is recognized by other household members as the head.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Land Tenure Types:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li><strong>Owned:</strong> Household owns the land with legal title</li>
            <li><strong>Rented:</strong> Household pays rent to use the land</li>
            <li><strong>Borrowed:</strong> Household uses land with permission but no payment</li>
            <li><strong>Other:</strong> Customary rights, disputed, or other arrangements</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HouseholdHeadStep
