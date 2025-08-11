import React from 'react'
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormGetValues } from 'react-hook-form'
import { MapPin, Target, CheckCircle } from 'lucide-react'
import { HouseholdFormData, locationOptions } from '../../lib/schemas'
import FormInput from '../forms/FormInput'
import FormSelect from '../forms/FormSelect'

interface LocationStepProps {
  register: UseFormRegister<HouseholdFormData>
  errors: FieldErrors<HouseholdFormData>
  setValue: UseFormSetValue<HouseholdFormData>
  getValues: UseFormGetValues<HouseholdFormData>
  gpsData: { lat: number; lng: number; accuracy: number } | null
  onCaptureGPS: () => void
}

const LocationStep: React.FC<LocationStepProps> = ({
  register,
  errors,
  setValue,
  getValues,
  gpsData,
  onCaptureGPS
}) => {
  const selectedProvince = getValues('province')
  const selectedDistrict = getValues('district')

  const provinceOptions = locationOptions.provinces.map(province => ({
    value: province,
    label: province
  }))

  const districtOptions = selectedProvince && locationOptions.districts[selectedProvince]
    ? locationOptions.districts[selectedProvince].map((district: string) => ({
        value: district,
        label: district
      }))
    : []

  const llgOptions = selectedDistrict && locationOptions.llgs[selectedDistrict]
    ? locationOptions.llgs[selectedDistrict].map((llg: string) => ({
        value: llg,
        label: llg
      }))
    : []

  // Clear dependent fields when parent changes
  const handleProvinceChange = (value: string) => {
    setValue('province', value)
    setValue('district', '')
    setValue('llg', '')
    setValue('ward', '')
  }

  const handleDistrictChange = (value: string) => {
    setValue('district', value)
    setValue('llg', '')
    setValue('ward', '')
  }

  const handleLlgChange = (value: string) => {
    setValue('llg', value)
    setValue('ward', '')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Household Location
        </h2>
        <p className="text-sm text-gray-500">
          Please provide the administrative location details for this household.
        </p>
      </div>

      {/* Administrative divisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Province"
          options={provinceOptions}
          registration={{
            ...register('province'),
            onChange: async (e) => {
              handleProvinceChange(e.target.value)
              return Promise.resolve()
            }
          }}
          error={errors.province?.message}
          required
        />

        <FormSelect
          label="District"
          options={districtOptions}
          registration={{
            ...register('district'),
            onChange: async (e) => {
              handleDistrictChange(e.target.value)
              return Promise.resolve()
            }
          }}
          error={errors.district?.message}
          required
          placeholder={selectedProvince ? 'Select district' : 'Select province first'}
        />

        <FormSelect
          label="Local Level Government (LLG)"
          options={llgOptions}
          registration={{
            ...register('llg'),
            onChange: async (e) => {
              handleLlgChange(e.target.value)
              return Promise.resolve()
            }
          }}
          error={errors.llg?.message}
          required
          placeholder={selectedDistrict ? 'Select LLG' : 'Select district first'}
        />

        <FormInput
          label="Ward"
          registration={register('ward')}
          error={errors.ward?.message}
          required
          placeholder="Enter ward name"
        />
      </div>

      <FormInput
        label="Hamlet/Village (Optional)"
        registration={register('hamlet')}
        error={errors.hamlet?.message}
        placeholder="Enter hamlet or village name"
      />

      {/* GPS Coordinates */}
      <div className="border-t pt-6">
        <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          GPS Coordinates
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {gpsData ? 'GPS Captured' : 'GPS Not Captured'}
              </p>
              {gpsData ? (
                <div className="text-xs text-gray-600 space-y-1 mt-1">
                  <p>Latitude: {gpsData.lat.toFixed(6)}</p>
                  <p>Longitude: {gpsData.lng.toFixed(6)}</p>
                  <p>Accuracy: ±{Math.round(gpsData.accuracy)}m</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Capture GPS coordinates for accurate location
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onCaptureGPS}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                gpsData
                  ? 'text-green-700 bg-green-100 hover:bg-green-200'
                  : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
              }`}
            >
              {gpsData ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Recapture
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Capture GPS
                </>
              )}
            </button>
          </div>

          {/* Manual GPS input (backup) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Latitude (Manual)"
              type="number"
              registration={register('gps_lat', { valueAsNumber: true })}
              error={errors.gps_lat?.message}
              placeholder="e.g., -4.123456"
            />
            <FormInput
              label="Longitude (Manual)"
              type="number"
              registration={register('gps_lng', { valueAsNumber: true })}
              error={errors.gps_lng?.message}
              placeholder="e.g., 144.123456"
            />
            <FormInput
              label="Accuracy (meters)"
              type="number"
              registration={register('gps_accuracy', { valueAsNumber: true })}
              error={errors.gps_accuracy?.message}
              placeholder="e.g., 5"
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Make sure you're at the household location before capturing GPS</li>
          <li>• GPS works without internet connection</li>
          <li>• For best accuracy, capture GPS outdoors with clear sky view</li>
          <li>• If GPS fails, you can enter coordinates manually</li>
        </ul>
      </div>
    </div>
  )
}

export default LocationStep

