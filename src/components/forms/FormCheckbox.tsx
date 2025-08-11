import React from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface FormCheckboxProps {
  label: string
  registration: UseFormRegisterReturn
  error?: string
  required?: boolean
  className?: string
  description?: string
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  registration,
  error,
  required = false,
  className = '',
  description
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            {...registration}
            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              error ? 'border-red-300' : ''
            }`}
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormCheckbox
