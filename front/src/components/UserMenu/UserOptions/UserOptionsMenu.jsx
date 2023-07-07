import UserOptionsMenuItem from '../UserMenuItem'
import Input from '../../Atoms/Input/Input'
import InputPassword from '../../Atoms/Input/InputPassword.jsx'
import { UserContext } from '../../Contexts/UserContext.jsx'
import AlertDiv from '../../Atoms/AlertDiv.jsx'
import { SocketContext } from '../../Contexts/SocketContext'
import ButtonClose from '../../Atoms/Btn/CloseBtn'
import InputUserPicture from '../../Atoms/Input/InputUserPicture'
import Picture from '../../Atoms/Picture/Picture'
import { host, apiPort } from '../../../../config'
import useModal from '../../../hooks/useModal'

import { useRef, useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Todo tester toutes les fonctions de UserOptionsMenu après l'implementation de useModal

function UserOptionsMenu() {
  const user = useContext(UserContext)
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  const { info, secondLogin } = useModal()

  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setconfirmNewPassword] = useState('')

  const [alertSpanContent, setAlertSpanContent] = useState('')
  const [emailInputValue, setEmailInputValue] = useState('')

  const nameInput = useRef(null)
  const firstnameInput = useRef(null)
  const newEmailInput = useRef(null)
  const confirmPasswordInput = useRef(null)

  const [fileToSend, setFileToSend] = useState(null)
  const [pictureCompInView, setPictureInView] = useState(null)
  const [deleteProfilePicture, setDeleteProfilePicture] = useState(false)

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
    }
  }

  async function onClickShowConfirmModal(event) {
    event.preventDefault()
    if (newPassword !== confirmNewPassword) {
      return info({
        title: 'Requête non  valide',
        errMessage:
          "Le nouveau mot de passe n'est pas identique à sa confirmation",
        styleOption: 'danger',
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
    console.log('user:update')
    socket.emit('user:update', {
      toUpdate: {
        name: nameInput?.current?.value,
        firstname: firstnameInput?.current?.value,
        newEmail: newEmailInput?.current?.value,
        email: emailInputValue,
        profile_picture: fileToSend,
        delete_profile_picture: deleteProfilePicture,
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
      setAlertSpanContent((alertSpanContent) =>
        alertSpanContent === '' ? alertSpanContent : ''
      )
    }
  }, [confirmNewPassword, newPassword])

  useEffect(() => {
    socket.on('user:update', ({ status }) => {
      switch (status) {
        case 204:
          info({
            title: 'Modification du compte réussie',
            styleOption: 'success',
          })
          break
        case 401:
          info({
            title: 'Action non autorisée.',
            errMessage:
              "Si l'erreur ce reproduit, merci de contacter l'administrateur",
            styleOption: 'danger',
          })
          break
        default:
          info({
            title: 'Incident inattendu',
            errMessage:
              "La requête a rencontré une erreur inattendue. Si l'erreur ce reproduit, merci de contacter l'administrateur",
            styleOption: 'danger',
          })
      }
    })
  }, [socket])

  return (
    <div
      className="rounded position-relative bg-white shadow-lg p-3 mb-5 mt-3 pt-0 overflow-scroll"
      style={{ maxHeight: '70vh', resize: 'both' }}
    >
      <div className="d-flex align-items-center gap-2 sticky-top bg-white pt-3 pb-2 border-bottom border-tertiary border-2">
        <h3 className="m-0 flex-grow-1">Paramètres utilisateurs</h3>
        <button
          onClick={onClickShowConfirmModal}
          className="btn btn-tertiary text-secondary mt-0 fw-bold"
        >
          Mise à jour
        </button>
        <Link to="..">
          <ButtonClose />
        </Link>
      </div>
      {user.is_admin && (
        <Input
          id="userEmailToInactivateInput"
          type="email"
          placeholder="name@example.com"
          label="Email du compte à modifier"
          onKeyUp={onKeyUpInputEmailValue}
        />
      )}
      <ul className="list-unstyled mb-0 pe-5 mb-3 d-flex flex-column gap-3">
        <UserOptionsMenuItem
          title={`${user.is_admin ? 'Réinitialiser' : 'Changer'} mot de passe`}
          autoFocus={true}
        >
          <InputPassword
            type="password"
            placeholder="new password"
            label="Nouveau mot de passe"
            onKeyUp={onKeyUpnewPasswordInput}
          />
          <InputPassword
            refInput={confirmPasswordInput}
            type="password"
            placeholder="new password"
            label="Confirmation mot du passe"
            onKeyUp={onKeyUpConfirmNewPasswordInput}
            onBlur={onBlurCheckPasswordInputs}
          />
          {alertSpanContent && <AlertDiv>{alertSpanContent}</AlertDiv>}
        </UserOptionsMenuItem>

        <UserOptionsMenuItem title="Changer patronyme">
          <Input
            refInput={nameInput}
            type="text"
            placeholder="nom"
            label="Nom"
          />
          <Input
            refInput={firstnameInput}
            type="text"
            placeholder="prénom"
            label="Prénom"
          />
        </UserOptionsMenuItem>
        <UserOptionsMenuItem title="Changer email">
          <Input
            refInput={newEmailInput}
            type="email"
            placeholder="name@example.com"
            label="Email"
          />
        </UserOptionsMenuItem>
        <UserOptionsMenuItem title="Changer photo de profil">
          <InputUserPicture
            setFileToSend={setFileToSend}
            setPictureInView={setPictureInView}
            setDeleteProfilePicture={setDeleteProfilePicture}
            deleteProfilePicture={deleteProfilePicture}
            label={`Photo de profil`}
          />
          {pictureCompInView ?? (
            <Picture
              url={
                user.profile_picture_url === 'default_url_avatar_picture' ||
                user.is_admin ||
                deleteProfilePicture
                  ? '../img/person.svg'
                  : `${host}:${apiPort}/private/${user.profile_picture_url}`
              }
              style={{ width: '100px', height: '100px' }}
            />
          )}
        </UserOptionsMenuItem>
      </ul>
    </div>
  )
}

export default UserOptionsMenu
