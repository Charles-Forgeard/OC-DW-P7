import UserMenuItem from '../UserMenuItem'
import Input from '../../Atoms/Input/Input'
import InputPassword from '../../Atoms/Input/InputPassword.jsx'
import FormBtn from '../../Atoms/Btn/FormBtn.jsx'
import AlertDiv from '../../Atoms/AlertDiv.jsx'
import useToggle from '../../../hooks/useToggle.jsx'
import { SocketContext } from '../../Contexts/SocketContext'
import LoginForm from '../../Login/LoginForm.jsx'
import Dialog from '../../Atoms/Dialog/Dialog'
import ButtonPrimary from '../../Atoms/Btn/PrimaryBtn'
import ButtonClose from '../../Atoms/Btn/CloseBtn'
import { accessControlByAdmin } from '../../../../config'
import SignUp from '../../SignUp/SignUp'

import { useRef, useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function UserOptionsMenu() {
  const socket = useContext(SocketContext)

  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setconfirmNewPassword] = useState('')

  const [alertSpanContent, setAlertSpanContent] = useState('')
  const [showConfirmUpdateModal, toggleShowConfirmUpdateModal] =
    useToggle(false)

  const [emailInputValue, setEmailInputValue] = useState('')
  const [showResponseModal, toggleResponseModal] = useToggle(false)
  const [messageResponseModal, setMessageResponseModal] = useState('')

  const logEmail = useRef(null)
  const logPassword = useRef(null)
  const confirmPasswordInput = useRef(null)

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

  function onKeyUpInputEmailValue(event) {
    event.preventDefault()
    setEmailInputValue(event.target.value)
  }

  function onBlurCheckPasswordInputs(event) {
    event.preventDefault()
    if (newPassword === confirmNewPassword) {
      setAlertSpanContent(
        "Le nouveau mot de passe n'est pas identique à sa confirmation"
      )
      toggleResponseModal()
    }
  }

  function onClickShowConfirmModal(event) {
    event.preventDefault()
    if (newPassword !== confirmNewPassword) {
      setMessageResponseModal(
        "Le nouveau mot de passe n'est pas identique à sa confirmation"
      )
      return toggleResponseModal()
    }
    toggleShowConfirmUpdateModal()
  }
  //{toUpdate: {name, firstname, email, password, profile_picture}, login : {logEmail, logPassword}}
  function onClickUpdateUser(event) {
    event.preventDefault()
    socket.emit('user:update', {
      toUpdate: {
        email: emailInputValue,
        newPassword:
          confirmNewPassword === newPassword ? newPassword : undefined,
      },

      login: {
        logEmail: logEmail?.current?.value,
        logPassword: logPassword?.current?.value,
      },
    })
  }

  function onClickToggleResponseModal(event) {
    event.preventDefault()
    toggleResponseModal()
  }

  useEffect(() => {
    const lastCharIndex = confirmNewPassword.length - 1
    const lastChar = confirmNewPassword[lastCharIndex]
    console.log(`lastCharIndex: ${lastCharIndex}, lastChar: ${lastChar}`)
    if (newPassword[lastCharIndex] !== lastChar) {
      setAlertSpanContent(
        'Cette lettre est différente du premier mot de passe.'
      )
    } else {
      setAlertSpanContent(alertSpanContent === '' ? alertSpanContent : '')
    }
  }, [confirmNewPassword, newPassword])

  useEffect(() => {
    socket.on('user:update', ({ status }) => {
      switch (status) {
        case 201:
          setMessageResponseModal('Nouvel utilisateur initializé')
          break
        case 204:
          setMessageResponseModal('Modification du compte réussie')
          break
        case 401:
          setMessageResponseModal('Action non autorisée.')
          break
        case 500:
          setMessageResponseModal(
            "La requete a rencontré une erreur. Si l'erreur ce reproduit, merci de contacter l'administrateur"
          )
          break
        default:
          setMessageResponseModal(
            "La requete a rencontré une erreur inattendue. Si l'erreur ce reproduit, merci de contacter l'administrateur"
          )
      }
      toggleResponseModal()
    })
  }, [socket, toggleResponseModal])

  function signUpCallback(response) {
    if (response.errorMessage) {
      setMessageResponseModal(response.errorMessage)
    } else {
      setMessageResponseModal('Nouveau compte utilisateur créé')
    }
    toggleResponseModal()
  }

  return (
    <div
      className="rounded position-relative bg-white shadow-lg p-3 mb-5 mt-3 overflow-scroll"
      style={{ maxHeight: '70vh', resize: 'both' }}
    >
      <h3>Paramètres administrateur</h3>
      <ul className="list-unstyled mb-0 pe-5 mb-3 d-flex flex-column gap-3">
        <UserMenuItem
          title="Réinitialiser mot de passe"
          onSubmit={onClickShowConfirmModal}
          autoFocus={true}
        >
          <Input
            id="userEmailToInactivateInput"
            type="email"
            placeholder="name@example.com"
            label="Email de l'utilisateur"
            required={true}
            onKeyUp={onKeyUpInputEmailValue}
          />

          <InputPassword
            type="password"
            placeholder="new password"
            label="Nouveau mot de passe temporaire"
            required={true}
            onKeyUp={onKeyUpnewPasswordInput}
          />
          <InputPassword
            refInput={confirmPasswordInput}
            type="password"
            placeholder="new password"
            label="Confirmation mot du passe"
            required={true}
            onKeyUp={onKeyUpConfirmNewPasswordInput}
            onBlur={onBlurCheckPasswordInputs}
          />
          {alertSpanContent && <AlertDiv>{alertSpanContent}</AlertDiv>}
          <FormBtn type="submit" className="mt-3">
            Réinitialiser
          </FormBtn>
        </UserMenuItem>
        {accessControlByAdmin && (
          <UserMenuItem
            title="Créer compte utilisateur"
            onSubmit={onClickShowConfirmModal}
          >
            <SignUp callback={signUpCallback} />
          </UserMenuItem>
        )}

        {showConfirmUpdateModal && (
          <Dialog open={true} onClose={toggleShowConfirmUpdateModal}>
            <div className="m-auto bg-white p-3 border border-3 border-primary rounded">
              <h6>Confirmation d&apos;identité requise</h6>
              <LoginForm
                refInputEmail={logEmail}
                refInputPassword={logPassword}
                action={onClickUpdateUser}
                title={null}
                list={null}
              />
            </div>
          </Dialog>
        )}
        {showResponseModal && (
          <Dialog open={true} role="alertdialog">
            <div className="m-auto shadow rounded p-3 bg-white border border-primary border-3">
              <p>{messageResponseModal}</p>
              <ButtonPrimary
                onClick={onClickToggleResponseModal}
                isAutoFocus={true}
              >
                Ok
              </ButtonPrimary>
            </div>
          </Dialog>
        )}
      </ul>
      <Link to="..">
        <ButtonClose />
      </Link>
    </div>
  )
}

export default UserOptionsMenu
