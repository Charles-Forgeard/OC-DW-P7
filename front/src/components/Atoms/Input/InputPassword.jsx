import EyeOffSvg from '../Icons/EyeOffSvg.jsx'
import EyeSvg from '../Icons/EyeSvg.jsx'
import inputValidationAria from './inputValidationAria'

import { useState, Fragment } from 'react'

function InputPassword({
  id,
  type,
  label,
  placeholder,
  onKeyUp,
  refInput,
  required,
  autoComplete,
}) {
  const [inputType, setInputType] = useState(type)

  const [helpString, setHelpString] = useState({})

  function onClickToggleInputType() {
    setInputType((inputType) =>
      inputType === 'password' ? 'text' : 'password'
    )
  }

  const { onInvalid, onInput, onBlur } = inputValidationAria({
    textOnInvalid:
      'Le mot de passe doit contenir: au mois 8 caractères, 1 chiffre, 1 minuscule, 1 majuscule et un caractère spécial (!?*#&...)',
    textOnInvalidCorrection:
      'Format du mot de passe invalide, il doit contenir au moins 8 caractères, 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial (!?*&$...)',
    textOnValidCorrection: 'Format du mot de passe valide',
    setHelpString: setHelpString,
  })

  return (
    <Fragment>
      <label htmlFor={id} className="form-label d-block">
        {label} {required && <span className="text-danger">(requis)</span>}
      </label>
      <div className="input-group mb-2">
        <input
          ref={refInput}
          type={inputType}
          className="form-control bg-opacity-50"
          id={id}
          placeholder={placeholder}
          onKeyUp={onKeyUp}
          pattern="(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
          autoComplete={autoComplete}
          required={required || false}
          aria-required={required || false}
          onBlur={onBlur}
          onInput={onInput}
          onInvalid={onInvalid}
        ></input>
        <button
          type="button"
          onClick={onClickToggleInputType}
          className="input-group-append bg-tertiary border rounded-end d-flex justify-content-center align-items-center"
          aria-label="rendre le mot de passe visible"
          aria-pressed={inputType === 'password' ? false : true}
        >
          {inputType === 'password' ? (
            <EyeOffSvg className="text-primary" />
          ) : (
            <EyeSvg className="text-primary" />
          )}
        </button>
      </div>
      {helpString.visible && (
        <span className={helpString.className} aria-live="polite" role="alert">
          {helpString.innerText}
        </span>
      )}
    </Fragment>
  )
}

export default InputPassword
