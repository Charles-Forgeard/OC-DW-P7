import { accessControlByAdmin } from '../../../config'
import Input from '../Atoms/Input/Input'
import InputPassword from '../Atoms/Input/InputPassword'
import useToggle from '../../hooks/useToggle'
import Dialog from '../Atoms/Dialog/Dialog'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import usePostLoginAndGoChat from '../../hooks/usePostLoginAndGoChat'

function LoginFormIndex() {
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)

  const [messageResponseModal, setMessageResponseModal] = useState('')
  const [showResponseModal, toggleResponseModal] = useToggle(false)

  const postLoginAndGoChat = usePostLoginAndGoChat(
    setMessageResponseModal,
    toggleResponseModal
  )

  async function onClickConnect() {
    postLoginAndGoChat({
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    })
  }

  function onClickToggleResponseModal(event) {
    event.preventDefault()
    toggleResponseModal()
    passwordInputRef.current.focus()
  }

  return (
    <div className="d-flex gap-3 flex-wrap mt-5">
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
        {!accessControlByAdmin && (
          <Link
            to="signUp"
            className="btn btn-tertiary text-secondary mt-3 me-3 fw-bold w-100"
          >
            Créer un nouveau compte
          </Link>
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
