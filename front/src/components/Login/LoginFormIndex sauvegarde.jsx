import { postLogin, postRegister } from '../../api/MsgAPI'
import Input from '../Atoms/Input/Input'
import InputPassword from '../Atoms/Input/InputPassword'
import AlertDiv from '../Atoms/AlertDiv'
import useToggle from '../../hooks/useToggle'
import Dialog from '../Atoms/Dialog/Dialog'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import ButtonTertiary from '../Atoms/Btn/TertiaryBtn'
import { useRef, useState, useEffect } from 'react'

function LoginFormIndex() {
  const config = { accessControlByAdmin: false }

  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const emailInputRegisterRef = useRef(null)

  const [messageResponseModal, setMessageResponseModal] = useState('')
  const [showResponseModal, toggleResponseModal] = useToggle(false)
  const [showRegisterForm, toggleRegisterForm] = useToggle(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setconfirmNewPassword] = useState('')
  const [alertSpanContent, setAlertSpanContent] = useState('')

  async function postLoginAndGoChat(payload) {
    const { data, error } = await postLogin(payload)

    console.log(data)

    if (error || data?.errorMessage || !data) {
      setMessageResponseModal(
        data?.errorMessage ? data?.errorMessage : 'Echec du login'
      )
      toggleResponseModal()
      return error ? console.error(error) : console.error(data?.errorMessage)
    }

    switch (data.message) {
      case 'User account is active':
        window.location = `${window.location.origin}/chat/`
        break
      case 'access denied':
        console.error('access denied')
        setMessageResponseModal('Identifiant et/ou mot de passe incorrect(s)')
        toggleResponseModal()
        break
      default:
        console.error('Valeur inattendue en réponse du fetchLogin', {
          data,
          error,
        })
    }
  }

  async function onClickConnect() {
    postLoginAndGoChat({
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    })
  }

  async function onClickRegisterUser(event) {
    event.preventDefault()
    const { data, error } = await postRegister({
      email: emailInputRegisterRef.current.value,
      password: newPassword,
    })

    if (error || data.errorMessage) {
      setMessageResponseModal(
        data.errorMessage
          ? data.errorMessage
          : 'Echec création nouvel utilisateur'
      )
      toggleResponseModal()
      return error ? console.error(error) : console.error(data.errorMessage)
    }

    postLoginAndGoChat({
      email: emailInputRegisterRef.current.value,
      password: newPassword,
    })
  }

  function onClickToggleResponseModal(event) {
    event.preventDefault()
    toggleResponseModal()
    passwordInputRef.current.focus()
  }

  function onClickShowRegisterForm(event) {
    event.preventDefault()
    toggleRegisterForm()
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
      {showRegisterForm && (
        <form className="col col-12 col-sm-6 col-md-5 col-lg-4 mx-auto shadow rounded p-3 bg-white">
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
          <ButtonPrimary onClick={onClickRegisterUser} className="w-100">
            Créer un nouveau compte
          </ButtonPrimary>
          <ButtonTertiary onClick={onClickShowRegisterForm} className="w-100">
            Annuler
          </ButtonTertiary>
        </form>
      )}
      <form className="col col-12 col-sm-6 col-md-5 col-lg-4 mx-auto shadow rounded p-3 bg-white">
        <Input
          refInput={emailInputRef}
          label="Email"
          type="email"
          placeholder="Inscrivez votre adresse email"
          required={true}
          autoComplete="email"
        />
        <InputPassword
          refInput={passwordInputRef}
          type="password"
          label="Mot de passe"
          placeholder="Inscrivez votre mot de passe"
          required={true}
          autoComplete="current-password"
        />
        <ButtonPrimary onClick={onClickConnect} className="w-100">
          Se connecter
        </ButtonPrimary>
        {!config.accessControlByAdmin && (
          <ButtonTertiary onClick={onClickShowRegisterForm} className="w-100">
            Créer un nouveau compte
          </ButtonTertiary>
        )}
      </form>
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

export default LoginFormIndex
