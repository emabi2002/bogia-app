import React from 'react'
import { UseFormRegister, FieldErrors, UseFormGetValues } from 'react-hook-form'
import {
  CheckCircle,
  MapPin,
  User,
  Users,
  Droplets,
  Zap,
  Car,
  Camera,
  AlertCircle
} from 'lucide-react'
import { HouseholdFormData } from '../../lib/schemas'
import FormCheckbox from '../forms/FormCheckbox'

interface ReviewStepProps {
  register: UseFormRegister<HouseholdFormData>
  errors: FieldErrors<HouseholdFormData>
  getValues: UseFormGetValues<HouseholdFormData>
  capturedPhotos: File[]
  onCapturePhoto: () => void
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  register,
  errors,
  getValues,
  capturedPhotos,
  onCapturePhoto
}) => {
  const formData = getValues()

  const SummarySection: React.FC<{
    title: string
    icon: React.ReactNode
    children: React.ReactNode
  }> = ({ title, icon, children }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      {children}
    </div>
  )

  const InfoRow: React.FC<{ label: string; value?: string | number | boolean }> = ({
    label,
    value
  }) => (
    <div className="flex justify-between py-1">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium text-gray-900">
        {value === true ? 'Yes' : value === false ? 'No' : value || 'Not provided'}
      </span>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Review & Submit
        </h2>
        <p className="text-sm text-gray-500">
          Please review all information before submitting the household survey.
        </p>
      </div>

      {/* Location Summary */}
      <SummarySection
        title="Location"
        icon={<MapPin className="h-4 w-4 text-blue-600" />}
      >
        <div className="space-y-1">
          <InfoRow label="Province" value={formData.province} />
          <InfoRow label="District" value={formData.district} />
          <InfoRow label="LLG" value={formData.llg} />
          <InfoRow label="Ward" value={formData.ward} />
          <InfoRow label="Hamlet" value={formData.hamlet} />
          {formData.gps_lat && formData.gps_lng && (
            <InfoRow
              label="GPS"
              value={`${formData.gps_lat.toFixed(6)}, ${formData.gps_lng.toFixed(6)}`}
            />
          )}
        </div>
      </SummarySection>

      {/* Household Head Summary */}
      <SummarySection
        title="Household Head"
        icon={<User className="h-4 w-4 text-green-600" />}
      >
        <div className="space-y-1">
          <InfoRow label="Name" value={formData.head_name} />
          <InfoRow label="Phone" value={formData.head_phone} />
          <InfoRow label="Land Tenure" value={formData.tenure} />
        </div>
      </SummarySection>

      {/* Household Members Summary */}
      <SummarySection
        title="Household Members"
        icon={<Users className="h-4 w-4 text-purple-600" />}
      >
        <div className="space-y-2">
          <InfoRow label="Total Members" value={formData.individuals?.length || 0} />
          <div className="text-sm">
            {formData.individuals?.map((individual, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600">
                  {individual.name_or_initials || `Person ${index + 1}`}
                </span>
                <span className="text-gray-900">
                  {individual.sex}, {individual.relationship}
                  {individual.age_years && ` (${individual.age_years}y)`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SummarySection>

      {/* WASH Summary */}
      <SummarySection
        title="WASH"
        icon={<Droplets className="h-4 w-4 text-blue-500" />}
      >
        <div className="space-y-1">
          <InfoRow label="Water Source" value={formData.water_source?.replace('_', ' ')} />
          <InfoRow label="Sanitation" value={formData.sanitation?.replace('_', ' ')} />
          <InfoRow label="Handwashing with Soap" value={formData.handwashing_soap} />
        </div>
      </SummarySection>

      {/* Energy & ICT Summary */}
      <SummarySection
        title="Energy & ICT"
        icon={<Zap className="h-4 w-4 text-yellow-600" />}
      >
        <div className="space-y-1">
          <InfoRow label="Lighting" value={formData.energy_lighting?.replace('_', ' ')} />
          <InfoRow label="Cooking Energy" value={formData.energy_cooking?.replace('_', ' ')} />
          <InfoRow label="Mobile Coverage" value={formData.mobile_coverage?.replace('_', ' ')} />
          <InfoRow label="Internet Access" value={formData.internet_access?.replace('_', ' ')} />
          <InfoRow label="Smartphones" value={formData.smartphones_count} />
        </div>
      </SummarySection>

      {/* Services Summary */}
      <SummarySection
        title="Service Access"
        icon={<Car className="h-4 w-4 text-red-600" />}
      >
        <div className="space-y-1">
          <InfoRow label="Health (minutes)" value={formData.services_health_mins} />
          <InfoRow label="School (minutes)" value={formData.services_school_mins} />
          <InfoRow label="Police (minutes)" value={formData.services_police_mins} />
          <InfoRow label="Market (minutes)" value={formData.services_market_mins} />
          <InfoRow label="Road Condition" value={formData.road_condition?.replace('_', ' ')} />
        </div>
      </SummarySection>

      {/* Photos */}
      <SummarySection
        title="Photos"
        icon={<Camera className="h-4 w-4 text-indigo-600" />}
      >
        <div className="space-y-3">
          <InfoRow label="Photos Captured" value={capturedPhotos.length} />

          {capturedPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {capturedPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Household photo ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                    Photo {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onCapturePhoto}
            className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Camera className="h-4 w-4 mr-2" />
            {capturedPhotos.length > 0 ? 'Add Another Photo' : 'Take Household Photo'}
          </button>
        </div>
      </SummarySection>

      {/* Consent */}
      <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
        <FormCheckbox
          label="Consent to Data Collection"
          registration={register('consent')}
          error={errors.consent?.message}
          required
          description="I confirm that all information provided is accurate and I consent to the collection of this household data for the Bogia Baseline Survey."
        />
      </div>

      {/* Data Privacy Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Data Privacy Notice
        </h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            This survey data will be used for baseline research purposes in the Bogia district.
            Your personal information will be kept confidential and used only for research and
            development planning.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Data is stored securely both locally and in the cloud</li>
            <li>Only authorized researchers will have access to individual responses</li>
            <li>Published results will be aggregated and anonymous</li>
            <li>You may request removal of your data at any time</li>
          </ul>
        </div>
      </div>

      {/* Enumerator Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Survey Information</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>Enumerator ID: {formData.enumerator_id}</p>
          <p>Survey Date: {new Date().toLocaleDateString()}</p>
          <p>App Version: 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default ReviewStep
