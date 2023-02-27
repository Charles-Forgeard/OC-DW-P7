import { useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import usePostLoginAndGoChat from '../../hooks/usePostLoginAndGoChat'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import InputPassword from '../Atoms/Input/InputPassword'
import AlertDiv from '../Atoms/AlertDiv'
//Todo change MsgApi to UserAPI ?
import { postActiveUserAccount } from '../../api/MsgAPI'
import useModal from '../../hooks/useModal'

function ActivateAccountForm() {
  const { state } = useLocation()
  const userEmail = state.userEmail
  const userTempPassword = state.tempPassword

  const passwordInputRef = useRef(null)

  const [newPassword, setNewPassword] = useState('')
  const [alertSpanContent, setAlertSpanContent] = useState('')
  const [confirmNewPassword, setconfirmNewPassword] = useState('')

  const { info } = useModal()

  const postLoginAndGoChat = usePostLoginAndGoChat()

  async function onSubmitActiveAccount(event) {
    event.preventDefault()
    if (newPassword !== confirmNewPassword) {
      return info({
        title: 'Requête invalide',
        errMessage:
          'Le mot de passe et sa confirmation doivent être identiques',
        styleOption: 'danger',
      })
    }
    if (newPassword === userTempPassword) {
      return info({
        title: 'Requête invalide',
        errMessage: "Le nouveau mot de passe doit être différent de l'ancien",
        styleOption: 'danger',
      })
    }
    const { data, error } = await postActiveUserAccount({
      email: userEmail,
      password: userTempPassword,
      newPassword: newPassword,
    })
    if (data?.message === 'User account actived') {
      return postLoginAndGoChat({ email: userEmail, password: newPassword })
    }
    if (error || data?.errorMessage || !data) {
      console.error(error ?? data)
      return info({
        title: 'Requête invalide',
        errMessage: "Le nouveau mot de passe doit être différent de l'ancien",
        styleOption: 'danger',
      })
    }
    info({
      title: 'Incident inattendu',
      errMessage: "Si l'erreur persiste, merci de contacter l'administrateur.",
      styleOption: 'danger',
    })
  }

  function onKeyUpnewPasswordInput(event) {
    event.preventDefault()
    setNewPassword(event.target.value)
  }

  function onKeyUpConfirmNewPasswordInput(event) {
    event.preventDefault()
    setconfirmNewPassword(event.target.value)
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
    <div className="d-flex gap-3 flex-wrap mt-5">
      <div className="col col-12 col-sm-6 col-md-5 col-lg-4 mx-auto shadow rounded p-3 bg-white">
        <h1>Activation du compte utilisateur</h1>
        <form onSubmit={onSubmitActiveAccount}>
          <InputPassword
            type="password"
            placeholder="new password"
            label="Mot de passe"
            onKeyUp={onKeyUpnewPasswordInput}
            required={true}
            autoComplete="new-password"
            ref={passwordInputRef}
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
          <ButtonPrimary className="w-100" type="submit">
            Activer compte
          </ButtonPrimary>
        </form>
      </div>
    </div>
  )
}

export default ActivateAccountForm
