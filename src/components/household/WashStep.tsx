import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Droplets, Bath, Sparkles } from 'lucide-react'
import { HouseholdFormData } from '../../lib/schemas'
import FormSelect from '../forms/FormSelect'
import FormCheckbox from '../forms/FormCheckbox'

interface WashStepProps {
  register: UseFormRegister<HouseholdFormData>
  errors: FieldErrors<HouseholdFormData>
}

const WashStep: React.FC<WashStepProps> = ({
  register,
  errors
}) => {
  const waterSourceOptions = [
    { value: 'piped_water', label: 'Piped Water to Dwelling' },
    { value: 'borehole', label: 'Borehole/Tubewell' },
    { value: 'protected_well', label: 'Protected Well' },
    { value: 'unprotected_well', label: 'Unprotected Well' },
    { value: 'surface_water', label: 'Surface Water (river, lake, stream)' },
    { value: 'rainwater', label: 'Rainwater Collection' },
    { value: 'bottled_water', label: 'Bottled Water' },
    { value: 'other', label: 'Other' }
  ]

  const sanitationOptions = [
    { value: 'flush_toilet', label: 'Flush Toilet' },
    { value: 'pit_latrine', label: 'Pit Latrine' },
    { value: 'composting_toilet', label: 'Composting Toilet' },
    { value: 'bucket_toilet', label: 'Bucket Toilet' },
    { value: 'hanging_toilet', label: 'Hanging Toilet' },
    { value: 'open_defecation', label: 'Open Defecation' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <Droplets className="h-5 w-5 mr-2" />
          Water, Sanitation & Hygiene (WASH)
        </h2>
        <p className="text-sm text-gray-500">
          Information about water sources, sanitation facilities, and hygiene practices.
        </p>
      </div>

      {/* Water Source */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <Droplets className="h-4 w-4 text-blue-600" />
          <h3 className="text-md font-medium text-gray-900">Water Source</h3>
        </div>

        <FormSelect
          label="Main Water Source for Drinking"
          options={waterSourceOptions}
          registration={register('water_source')}
          error={errors.water_source?.message}
          required
          placeholder="Select primary water source"
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Water Source Categories:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Improved sources:</strong> Piped water, boreholes, protected wells, rainwater</p>
            <p><strong>Unimproved sources:</strong> Unprotected wells, surface water</p>
          </div>
        </div>
      </div>

      {/* Sanitation */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center space-x-2 mb-3">
          <Bath className="h-4 w-4 text-green-600" />
          <h3 className="text-md font-medium text-gray-900">Sanitation</h3>
        </div>

        <FormSelect
          label="Type of Sanitation Facility"
          options={sanitationOptions}
          registration={register('sanitation')}
          error={errors.sanitation?.message}
          required
          placeholder="Select sanitation facility type"
        />

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Sanitation Types:</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Improved:</strong> Flush toilets, pit latrines with slabs, composting toilets</p>
            <p><strong>Unimproved:</strong> Pit latrines without slabs, bucket toilets, hanging toilets</p>
            <p><strong>Open defecation:</strong> No facility use, fields, forests, bodies of water</p>
          </div>
        </div>
      </div>

      {/* Hygiene */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <h3 className="text-md font-medium text-gray-900">Hygiene</h3>
        </div>

        <FormCheckbox
          label="Handwashing with Soap Available"
          registration={register('handwashing_soap')}
          error={errors.handwashing_soap?.message}
          required
          description="Does the household have a place to wash hands with soap and water?"
        />

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-800 mb-2">About Handwashing:</h4>
          <p className="text-sm text-purple-700">
            This includes any location where household members can wash their hands with soap and water.
            It could be a fixed facility (like a sink) or a mobile one (like a basin with soap and water).
          </p>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Why WASH Matters:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Safe water prevents waterborne diseases</li>
          <li>• Proper sanitation protects community health</li>
          <li>• Handwashing with soap reduces illness by up to 50%</li>
          <li>• WASH improvements support education and economic development</li>
        </ul>
      </div>
    </div>
  )
}

export default WashStep
