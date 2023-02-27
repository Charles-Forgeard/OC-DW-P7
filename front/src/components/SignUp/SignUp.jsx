import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import Input from '../Atoms/Input/Input'
import InputPassword from '../Atoms/Input/InputPassword'
import { useRef, useState, useEffect } from 'react'
import { postRegister } from '../../api/MsgAPI'
import AlertDiv from '../Atoms/AlertDiv'
import useModal from '../../hooks/useModal'

const SignUp = ({ children, callback, beforeSignUp }) => {
  const emailInputRegisterRef = useRef(null)
  const [newPassword, setNewPassword] = useState('')
  const [alertSpanContent, setAlertSpanContent] = useState('')
  const [confirmNewPassword, setconfirmNewPassword] = useState('')

  const { info } = useModal()

  function onKeyUpnewPasswordInput(event) {
    event.preventDefault()
    setNewPassword(event.target.value)
  }

  function onKeyUpConfirmNewPasswordInput(event) {
    event.preventDefault()
    setconfirmNewPassword(event.target.value)
  }

  async function onClickSignUp(event) {
    event.preventDefault()
    console.log('click')
    if (beforeSignUp) {
      console.log('beforeSignUp')
      const result = await beforeSignUp()
      if (!result) return
    }
    const { data, error } = await postRegister({
      email: emailInputRegisterRef.current.value,
      password: newPassword,
    })

    if (error || data?.errorMessage || !data) {
      console.error(error ?? data)
      return info({
        title: 'Echec création nouvel utilisateur',
        errMessage:
          "Si le problème persiste, merci de contacter l'administrateur.",
        styleOption: 'danger',
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
