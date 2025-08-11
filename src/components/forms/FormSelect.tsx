import React from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface FormSelectProps {
  label: string
  options: { value: string; label: string }[]
  registration: UseFormRegisterReturn
  error?: string
  required?: boolean
  placeholder?: string
  className?: string
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  registration,
  error,
  required = false,
  placeholder = 'Select an option',
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...registration}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-500'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormSelect
