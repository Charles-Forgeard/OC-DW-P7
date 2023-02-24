import { useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import useToggle from '../../hooks/useToggle'
import usePostLoginAndGoChat from '../../hooks/usePostLoginAndGoChat'
import Dialog from '../Atoms/Dialog/Dialog'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import InputPassword from '../Atoms/Input/InputPassword'
import AlertDiv from '../Atoms/AlertDiv'
//change MsgApi to UserAPI
import { postActiveUserAccount } from '../../api/MsgAPI'

function ActivateAccountForm() {
  const { state } = useLocation()
  const userEmail = state.userEmail
  const userTempPassword = state.tempPassword

  const passwordInputRef = useRef(null)

  const [messageResponseModal, setMessageResponseModal] = useState('')
  const [showResponseModal, toggleResponseModal] = useToggle(false)

  const [newPassword, setNewPassword] = useState('')
  const [alertSpanContent, setAlertSpanContent] = useState('')
  const [confirmNewPassword, setconfirmNewPassword] = useState('')

  const postLoginAndGoChat = usePostLoginAndGoChat(
    setMessageResponseModal,
    toggleResponseModal
  )

  async function onSubmitActiveAccount(event) {
    event.preventDefault()
    if (newPassword !== confirmNewPassword) {
      setMessageResponseModal(
        'Le mot de passe et sa confirmation doivent être identiques'
      )
      toggleResponseModal()
      return
    }
    if (newPassword === userTempPassword) {
      setMessageResponseModal(
        "Le nouveau mot de passe doit être différent de l'ancien"
      )
      toggleResponseModal()
      return
    }
    const { data, error } = await postActiveUserAccount({
      email: userEmail,
      password: userTempPassword,
      newPassword: newPassword,
    })
    if (error || data?.errorMessage || !data) {
      setMessageResponseModal(
        data?.errorMessage
          ? data?.errorMessage
          : "Echec de l'activation du compte utilisateur"
      )
      toggleResponseModal()
      return error ? console.error(error) : console.error(data?.errorMessage)
    }
    if (data.message === 'User account actived') {
      postLoginAndGoChat({ email: userEmail, password: newPassword })
    }
  }

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

  function onClickToggleResponseModal(event) {
    event.preventDefault()
    toggleResponseModal()
    passwordInputRef.current.focus()
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
      {showResponseModal && (
        <Dialog open={true} role="alertdialog" center={true}>
          <div className="m-auto shadow rounded p-3 bg-white border border-primary border-3">
            <p>{messageResponseModal}</p>
            <ButtonPrimary
              onClick={onClickToggleResponseModal}
              isAutoFocus={true}
              className="w-100"
            >
              Ok
            </ButtonPrimary>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default ActivateAccountForm
