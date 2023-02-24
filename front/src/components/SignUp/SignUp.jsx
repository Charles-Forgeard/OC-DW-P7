import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import Input from '../Atoms/Input/Input'
import InputPassword from '../Atoms/Input/InputPassword'
import { useRef, useState, useEffect } from 'react'
import { postRegister } from '../../api/MsgAPI'
import AlertDiv from '../Atoms/AlertDiv'

const SignUp = ({ children, callback }) => {
  const emailInputRegisterRef = useRef(null)
  const [newPassword, setNewPassword] = useState('')
  const [alertSpanContent, setAlertSpanContent] = useState('')
  const [confirmNewPassword, setconfirmNewPassword] = useState('')

  function onKeyUpnewPasswordInput(event) {
    event.preventDefault()
    console.log('newPassword: ' + event.target.value)
    setNewPassword(event.target.value)
  }

  function onKeyUpConfirmNewPasswordInput(event) {
    event.preventDefault()
    console.log('confirmNewPassword: ' + event.target.value)
    setconfirmNewPassword(event.target.value)
  }

  async function onClickSignUp(event) {
    event.preventDefault()
    const { data, error } = await postRegister({
      email: emailInputRegisterRef.current.value,
      password: newPassword,
    })

    if (error || data.errorMessage) {
      console.error(error ?? data.errorMessage)
      return callback({
        errorMessage: data.errorMessage ?? 'Echec création nouvel utilisateur',
      })
    }

    callback({
      email: emailInputRegisterRef.current.value,
      password: newPassword,
    })
  }

  useEffect(() => {
    const lastCharIndex = confirmNewPassword.length - 1
    const lastChar = confirmNewPassword[lastCharIndex]
    if (newPassword[lastCharIndex] !== lastChar) {
      setAlertSpanContent(
        'Cette lettre est différente du premier mot de passe.'
      )
    } else {
      setAlertSpanContent('')
    }
  }, [confirmNewPassword, newPassword])

  return (
    <>
      <Input
        refInput={emailInputRegisterRef}
        label="Email"
        type="email"
        placeholder="Inscrivez votre adresse email"
        required={true}
        autoComplete="email"
      />
      <InputPassword
        type="password"
        placeholder="new password"
        label="Mot de passe"
        onKeyUp={onKeyUpnewPasswordInput}
        required={true}
        autoComplete="new-password"
      />
      <InputPassword
        type="password"
        placeholder="new password"
        label="Confirmation mot du passe"
        onKeyUp={onKeyUpConfirmNewPasswordInput}
        required={true}
        autoComplete="new-password"
      />
      {alertSpanContent && <AlertDiv>{alertSpanContent}</AlertDiv>}
      <ButtonPrimary className="w-100" onClick={onClickSignUp}>
        Créer un nouveau compte
      </ButtonPrimary>
      {children}
    </>
  )
}

export default SignUp
