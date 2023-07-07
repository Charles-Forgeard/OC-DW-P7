import UserOptionsMenuItem from '../UserMenuItem'
import Input from '../../Atoms/Input/Input'
import InputPassword from '../../Atoms/Input/InputPassword.jsx'
import FormBtn from '../../Atoms/Btn/FormBtn.jsx'
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
      className="rounded position-relative bg-white shadow-lg p-3 mb-5 mt-3 overflow-scroll"
      style={{ maxHeight: '70vh', resize: 'both' }}
    >
      <h3>Paramètres utilisateurs</h3>
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
          title="Réinitialiser mot de passe"
          onSubmit={onClickShowConfirmModal}
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
          <FormBtn type="submit" className="mt-3">
            Mise à jour
          </FormBtn>
        </UserOptionsMenuItem>

        <UserOptionsMenuItem
          title="Profil utilisateur"
          onSubmit={onClickShowConfirmModal}
        >
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
          <Input
            refInput={newEmailInput}
            type="email"
            placeholder="name@example.com"
            label="Email"
          />
          <InputUserPicture
            setFileToSend={setFileToSend}
            setPictureInView={setPictureInView}
            label={`Photo de profil`}
          />
          {pictureCompInView ?? (
            <Picture
              url={
                user.profile_picture_url === 'default_url_avatar_picture' ||
                user.is_admin
                  ? '../img/person.svg'
                  : `${host}:${apiPort}/private/${user.profile_picture_url}`
              }
              style={{ width: '100px', height: '100px' }}
            />
          )}
          <FormBtn type="submit" className="d-block mt-3">
            Mise à jour
          </FormBtn>
        </UserOptionsMenuItem>
      </ul>
      <Link to="..">
        <ButtonClose />
      </Link>
    </div>
  )
}

export default UserOptionsMenu
