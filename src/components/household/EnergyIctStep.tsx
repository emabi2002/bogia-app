import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Zap, Flame, Smartphone, Wifi } from 'lucide-react'
import { HouseholdFormData } from '../../lib/schemas'
import FormSelect from '../forms/FormSelect'
import FormInput from '../forms/FormInput'

interface EnergyIctStepProps {
  register: UseFormRegister<HouseholdFormData>
  errors: FieldErrors<HouseholdFormData>
}

const EnergyIctStep: React.FC<EnergyIctStepProps> = ({
  register,
  errors
}) => {
  const lightingOptions = [
    { value: 'electricity', label: 'Grid Electricity' },
    { value: 'solar', label: 'Solar Power' },
    { value: 'generator', label: 'Generator' },
    { value: 'kerosene', label: 'Kerosene Lamps' },
    { value: 'candles', label: 'Candles' },
    { value: 'other', label: 'Other' }
  ]

  const cookingOptions = [
    { value: 'electricity', label: 'Electric Stove' },
    { value: 'gas', label: 'Gas Stove' },
    { value: 'firewood', label: 'Firewood' },
    { value: 'charcoal', label: 'Charcoal' },
    { value: 'kerosene', label: 'Kerosene Stove' },
    { value: 'other', label: 'Other' }
  ]

  const mobileCoverageOptions = [
    { value: 'digicel', label: 'Digicel Only' },
    { value: 'bmobile', label: 'bmobile Only' },
    { value: 'telikom', label: 'Telikom Only' },
    { value: 'multiple', label: 'Multiple Networks' },
    { value: 'none', label: 'No Coverage' }
  ]

  const internetAccessOptions = [
    { value: 'mobile_data', label: 'Mobile Data Only' },
    { value: 'wifi', label: 'WiFi Only' },
    { value: 'both', label: 'Both Mobile Data & WiFi' },
    { value: 'none', label: 'No Internet Access' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Energy & Information Technology
        </h2>
        <p className="text-sm text-gray-500">
          Information about energy sources and communication technology access.
        </p>
      </div>

      {/* Energy Sources */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="h-4 w-4 text-yellow-600" />
          <h3 className="text-md font-medium text-gray-900">Energy Sources</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Primary Lighting Source"
            options={lightingOptions}
            registration={register('energy_lighting')}
            error={errors.energy_lighting?.message}
            required
            placeholder="Select lighting source"
          />

          <FormSelect
            label="Primary Cooking Energy"
            options={cookingOptions}
            registration={register('energy_cooking')}
            error={errors.energy_cooking?.message}
            required
            placeholder="Select cooking energy"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Energy Access Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Grid electricity:</strong> Connected to main power grid</li>
            <li>• <strong>Solar:</strong> Solar panels or solar home systems</li>
            <li>• <strong>Generator:</strong> Petrol, diesel, or other fuel generator</li>
            <li>• <strong>Traditional:</strong> Kerosene, candles, firewood, charcoal</li>
          </ul>
        </div>
      </div>

      {/* Mobile & Internet */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center space-x-2 mb-3">
          <Smartphone className="h-4 w-4 text-blue-600" />
          <h3 className="text-md font-medium text-gray-900">Mobile & Internet Access</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Mobile Network Coverage"
            options={mobileCoverageOptions}
            registration={register('mobile_coverage')}
            error={errors.mobile_coverage?.message}
            required
            placeholder="Select mobile coverage"
          />

          <FormSelect
            label="Internet Access Type"
            options={internetAccessOptions}
            registration={register('internet_access')}
            error={errors.internet_access?.message}
            required
            placeholder="Select internet access"
          />
        </div>

        <FormInput
          label="Number of Smartphones in Household"
          type="number"
          registration={register('smartphones_count', { valueAsNumber: true })}
          error={errors.smartphones_count?.message}
          placeholder="Enter number of smartphones"
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">ICT in PNG:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Digicel:</strong> Largest mobile network in PNG</li>
            <li>• <strong>bmobile:</strong> Vodafone PNG, second largest network</li>
            <li>• <strong>Telikom:</strong> PNG's telecommunications corporation</li>
            <li>• Mobile data is primary internet access method in rural areas</li>
          </ul>
        </div>
      </div>

      {/* Digital Connectivity Impact */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800 mb-2">Why Energy & ICT Matter:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Energy access improves education, health, and economic opportunities</li>
          <li>• Mobile connectivity enables financial services, market information</li>
          <li>• Internet access supports education, business, and communication</li>
          <li>• Clean cooking reduces indoor air pollution and health risks</li>
        </ul>
      </div>
    </div>
  )
}

export default EnergyIctStep
