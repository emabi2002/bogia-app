import React from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface FormInputProps {
  label: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'date'
  placeholder?: string
  registration: UseFormRegisterReturn
  error?: string
  required?: boolean
  className?: string
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  placeholder,
  registration,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-500'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormInput
