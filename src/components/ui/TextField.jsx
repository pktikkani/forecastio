import React from 'react'

const formClasses =
  'block w-full appearance-none rounded-lg border border-white/20 bg-white/50 backdrop-blur-sm px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm sm:text-sm transition-all'

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="mb-3 block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  )
}

export function TextField({ label, type = 'text', className, id, ...props }) {
  const inputId = id || `field-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={className}>
      {label && <Label id={inputId}>{label}</Label>}
      <input id={inputId} type={type} {...props} className={formClasses} />
    </div>
  )
}

export function SelectField({ label, className, id, children, ...props }) {
  const selectId = id || `field-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={className}>
      {label && <Label id={selectId}>{label}</Label>}
      <select id={selectId} {...props} className={`${formClasses} pr-8`}>
        {children}
      </select>
    </div>
  )
}