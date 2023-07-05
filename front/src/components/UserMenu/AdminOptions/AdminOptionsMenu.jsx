import UserMenuItem from '../UserMenuItem'
import Input from '../../Atoms/Input/Input'
import InputPassword from '../../Atoms/Input/InputPassword.jsx'
import FormBtn from '../../Atoms/Btn/FormBtn.jsx'
import AlertDiv from '../../Atoms/AlertDiv.jsx'
import { SocketContext } from '../../Contexts/SocketContext'
import ButtonClose from '../../Atoms/Btn/CloseBtn'
import { accessControlByAdmin } from '../../../../config'
import SignUp from '../../SignUp/SignUp'
import useModal from '../../../hooks/useModal'

import { useRef, useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function UserOptionsMenu() {
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  const { info, secondLogin } = useModal()
  const { info, secondLogin } = useModal()

  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setconfirmNewPassword] = useState('')

  const [alertSpanContent, setAlertSpanContent] = useState('')

  const [emailInputValue, setEmailInputValue] = useState('')
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
    if (newPassword !== confirmNewPassword) {
      setAlertSpanContent(
        "Le nouveau mot de passe n'est pas identique à sa confirmation"
      )
    }
  }

  async function onSubmitShowConfirmModal(event) {
    event.preventDefault()
    if (newPassword !== confirmNewPassword) {
      return info({
        title: 'Requête invalide',
        errMessage:
          "Le nouveau mot de passe n'est pas identique à sa confirmation",
        stypeOption: 'danger',
      })
    }
    const isValid = await secondLogin()

    if (isValid) {
      updateUser()
      navigate(-1)
    }
  }
  //{toUpdate: {name, firstname, email, password, profile_picture}, login : {logEmail, logPassword}}
  function updateUser() {
    socket.emit('user:update', {
      toUpdate: {
        email: emailInputValue,
        newPassword:
          confirmNewPassword === newPassword ? newPassword : undefined,
      },
    })
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
          info({
            title: 'Nouvel utilisateur initialisé',
            styleOption: 'success',
          })
          break
        case 204:
          info({
            title: 'Modification du compte réussie',
            styleOption: 'success',
          })
          break
        case 401:
          info({
            title: 'Action non autorisée.',
            styleOption: 'danger',
          })
          break
        default:
          info({
            title: 'Incident inattendu',
            errMessage:
              "La requête a rencontré une erreur inattendue. Si l'erreur ce reproduit, merci de contacter l'entreprise ayant créé le site",
            styleOption: 'danger',
          })
      }
    })
  }, [socket])

  function signUpCallback() {
    navigate(-1)
    info({
      title: 'Nouveau compte utilisateur créé',
      styleOption: 'success',
    })
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
          onSubmit={onSubmitShowConfirmModal}
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
            onSubmit={onSubmitShowConfirmModal}
          >
            <SignUp callback={signUpCallback} beforeSignUp={secondLogin} />
          </UserMenuItem>
        )}
      </ul>
      <Link to="..">
        <ButtonClose />
      </Link>
    </div>
  )
}

export default UserOptionsMenu
