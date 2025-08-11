import React, { useState } from 'react'
import {
  UseFormRegister,
  FieldErrors,
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormWatch
} from 'react-hook-form'
import { Users, Plus, Minus, User, Calendar, GraduationCap, Briefcase } from 'lucide-react'
import { HouseholdFormData, IndividualFormData, skillOptions } from '../../lib/schemas'
import FormInput from '../forms/FormInput'
import FormSelect from '../forms/FormSelect'
import FormCheckbox from '../forms/FormCheckbox'

interface RosterStepProps {
  register: UseFormRegister<HouseholdFormData>
  control: Control<HouseholdFormData>
  errors: FieldErrors<HouseholdFormData>
  watch: UseFormWatch<HouseholdFormData>
  individualFields: FieldArrayWithId<HouseholdFormData, 'individuals', 'id'>[]
  appendIndividual: UseFieldArrayAppend<HouseholdFormData, 'individuals'>
  removeIndividual: UseFieldArrayRemove
}

const RosterStep: React.FC<RosterStepProps> = ({
  register,
  errors,
  watch,
  individualFields,
  appendIndividual,
  removeIndividual
}) => {
  const [expandedIndividual, setExpandedIndividual] = useState<number>(0)

  const relationshipOptions = [
    { value: 'head', label: 'Head' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'other_relative', label: 'Other Relative' },
    { value: 'non_relative', label: 'Non-Relative' }
  ]

  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'separated', label: 'Separated' }
  ]

  const educationLevelOptions = [
    { value: 'none', label: 'No Education' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'tertiary', label: 'Tertiary' },
    { value: 'vocational', label: 'Vocational' }
  ]

  const livelihoodOptions = [
    { value: 'formal', label: 'Formal Employment' },
    { value: 'informal', label: 'Informal Employment' },
    { value: 'farmer', label: 'Farmer' },
    { value: 'fisher', label: 'Fisher' },
    { value: 'student', label: 'Student' },
    { value: 'unpaid_care', label: 'Unpaid Care Work' },
    { value: 'unemployed', label: 'Unemployed' }
  ]

  const disabilityOptions = [
    { value: 'none', label: 'No difficulty' },
    { value: 'some', label: 'Some difficulty' },
    { value: 'a_lot', label: 'A lot of difficulty' },
    { value: 'cannot', label: 'Cannot do at all' }
  ]

  const availabilityOptions = [
    { value: 'full', label: 'Full time' },
    { value: 'part', label: 'Part time' },
    { value: 'seasonal', label: 'Seasonal' }
  ]

  const addIndividual = () => {
    appendIndividual({
      name_or_initials: '',
      sex: 'male',
      relationship: 'child',
      disability_seeing: 'none',
      disability_hearing: 'none',
      disability_walking: 'none',
      disability_remembering: 'none',
      disability_selfcare: 'none',
      disability_communication: 'none'
    })
    setExpandedIndividual(individualFields.length)
  }

  const calculateAge = (dob: string): number => {
    if (!dob) return 0
    const birthDate = new Date(dob)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  const IndividualForm: React.FC<{ index: number; individual: any }> = ({ index, individual }) => {
    const watchedDob = watch(`individuals.${index}.dob`)
    const watchedAge = watch(`individuals.${index}.age_years`)
    const calculatedAge = watchedDob ? calculateAge(watchedDob) : watchedAge || 0
    const isYouth = calculatedAge >= 15 && calculatedAge <= 35

    return (
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Individual {index + 1}
            {individual.name_or_initials && ` - ${individual.name_or_initials}`}
          </h4>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setExpandedIndividual(expandedIndividual === index ? -1 : index)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {expandedIndividual === index ? 'Collapse' : 'Expand'}
            </button>
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
        </div>

        {/* Basic information - always visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Name or Initials"
            registration={register(`individuals.${index}.name_or_initials`)}
            error={errors.individuals?.[index]?.name_or_initials?.message}
            required
            placeholder="Enter name or initials"
          />

          <FormSelect
            label="Sex"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' }
            ]}
            registration={register(`individuals.${index}.sex`)}
            error={errors.individuals?.[index]?.sex?.message}
            required
          />

          <FormSelect
            label="Relationship to Head"
            options={relationshipOptions}
            registration={register(`individuals.${index}.relationship`)}
            error={errors.individuals?.[index]?.relationship?.message}
            required
          />
        </div>

        {/* Expanded details */}
        {expandedIndividual === index && (
          <div className="space-y-4 border-t pt-4">
            {/* Age and DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Date of Birth"
                type="date"
                registration={register(`individuals.${index}.dob`)}
                error={errors.individuals?.[index]?.dob?.message}
              />
              <FormInput
                label="Age (Years)"
                type="number"
                registration={register(`individuals.${index}.age_years`, { valueAsNumber: true })}
                error={errors.individuals?.[index]?.age_years?.message}
                placeholder="Enter age if DOB unknown"
              />
            </div>

            <FormSelect
              label="Marital Status"
              options={maritalStatusOptions}
              registration={register(`individuals.${index}.marital_status`)}
              error={errors.individuals?.[index]?.marital_status?.message}
              placeholder="Select marital status"
            />

            {/* Education */}
            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                Education
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormCheckbox
                  label="Currently in School"
                  registration={register(`individuals.${index}.in_school`)}
                  error={errors.individuals?.[index]?.in_school?.message}
                />
                <FormInput
                  label="Current Grade"
                  registration={register(`individuals.${index}.grade_current`)}
                  error={errors.individuals?.[index]?.grade_current?.message}
                  placeholder="e.g., Grade 8"
                />
                <FormSelect
                  label="Highest Education Level"
                  options={educationLevelOptions}
                  registration={register(`individuals.${index}.highest_level`)}
                  error={errors.individuals?.[index]?.highest_level?.message}
                  placeholder="Select highest level"
                />
              </div>
            </div>

            {/* Livelihood */}
            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Livelihood
              </h5>
              <FormSelect
                label="Primary Livelihood"
                options={livelihoodOptions}
                registration={register(`individuals.${index}.livelihood`)}
                error={errors.individuals?.[index]?.livelihood?.message}
                placeholder="Select primary livelihood"
              />
            </div>

            {/* Disability (Washington Group Short Set) */}
            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">
                Disability (Washington Group Short Set)
              </h5>
              <p className="text-sm text-gray-500 mb-4">
                Do you have difficulty with any of the following?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Seeing (even with glasses)"
                  options={disabilityOptions}
                  registration={register(`individuals.${index}.disability_seeing`)}
                  error={errors.individuals?.[index]?.disability_seeing?.message}
                />
                <FormSelect
                  label="Hearing (even with hearing aid)"
                  options={disabilityOptions}
                  registration={register(`individuals.${index}.disability_hearing`)}
                  error={errors.individuals?.[index]?.disability_hearing?.message}
                />
                <FormSelect
                  label="Walking or climbing steps"
                  options={disabilityOptions}
                  registration={register(`individuals.${index}.disability_walking`)}
                  error={errors.individuals?.[index]?.disability_walking?.message}
                />
                <FormSelect
                  label="Remembering or concentrating"
                  options={disabilityOptions}
                  registration={register(`individuals.${index}.disability_remembering`)}
                  error={errors.individuals?.[index]?.disability_remembering?.message}
                />
                <FormSelect
                  label="Self-care (washing/dressing)"
                  options={disabilityOptions}
                  registration={register(`individuals.${index}.disability_selfcare`)}
                  error={errors.individuals?.[index]?.disability_selfcare?.message}
                />
                <FormSelect
                  label="Communicating"
                  options={disabilityOptions}
                  registration={register(`individuals.${index}.disability_communication`)}
                  error={errors.individuals?.[index]?.disability_communication?.message}
                />
              </div>
            </div>

            {/* Youth section (15-35 years) */}
            {isYouth && (
              <div className="border-t pt-4 bg-blue-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 mb-3">
                  Youth Information (Ages 15-35)
                </h5>
                <div className="space-y-4">
                  <FormSelect
                    label="Availability for Work"
                    options={availabilityOptions}
                    registration={register(`individuals.${index}.availability`)}
                    error={errors.individuals?.[index]?.availability?.message}
                    placeholder="Select availability"
                  />
                  <FormInput
                    label="Training Needs"
                    registration={register(`individuals.${index}.training_need`)}
                    error={errors.individuals?.[index]?.training_need?.message}
                    placeholder="What training would be most helpful?"
                  />
                  {/* Note: Skills would typically be a multi-select, simplified here */}
                  <FormInput
                    label="Skills (comma-separated)"
                    registration={register(`individuals.${index}.skills`)}
                    error={errors.individuals?.[index]?.skills?.message}
                    placeholder="e.g., carpentry, computer skills, cooking"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Household Roster
        </h2>
        <p className="text-sm text-gray-500">
          Please provide information for all household members.
        </p>
      </div>

      <div className="space-y-4">
        {individualFields.map((individual, index) => (
          <IndividualForm key={individual.id} index={index} individual={individual} />
        ))}
      </div>

      <button
        type="button"
        onClick={addIndividual}
        className="w-full flex items-center justify-center px-4 py-3 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Household Member
      </button>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Summary:</h4>
        <p className="text-sm text-gray-600">
          Total household members: {individualFields.length}
        </p>
      </div>
    </div>
  )
}

export default RosterStep
