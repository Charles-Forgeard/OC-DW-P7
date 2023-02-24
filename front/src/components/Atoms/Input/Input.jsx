import React, { Fragment, useState } from 'react'
import inputValidationAria from './inputValidationAria'

function Input({
  id,
  type,
  label,
  placeholder,
  refInput,
  required,
  onKeyUp,
  autoComplete,
}) {
  const [helpString, setHelpString] = useState({})

  const { onInvalid, onInput, onBlur } = inputValidationAria({
    textOnInvalidCorrection: "Format d'email invalide.",
    textOnValidCorrection: "Format d'email valide",
    setHelpString: setHelpString,
  })

  return (
    <Fragment>
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="text-danger">(requis)</span>}
      </label>
      <input
        ref={refInput}
        type={type}
        className="form-control bg-opacity-50 mb-2"
        id={id}
        placeholder={placeholder}
        required={required || false}
        autoComplete={autoComplete}
        aria-required={required || false}
        onKeyUp={onKeyUp}
        onInvalid={onInvalid}
        onInput={onInput}
        onBlur={onBlur}
      ></input>
      {helpString.visible && (
        <span className={helpString.className} role="alert" aria-live="polite">
          {helpString.innerText}
        </span>
      )}
    </Fragment>
  )
}

export default Input
