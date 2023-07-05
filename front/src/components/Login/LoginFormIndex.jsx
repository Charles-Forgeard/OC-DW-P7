import { accessControlByAdmin } from '../../../config'
import Input from '../Atoms/Input/Input'
import InputPassword from '../Atoms/Input/InputPassword'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import usePostLoginAndGoChat from '../../hooks/usePostLoginAndGoChat'
import LoadingSpinnerInBtn from '../Atoms/Spinner/LoadingSpinnerInBtn'

function LoginFormIndex() {
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const [loginReqIsLoading, setLoginReqIsLoading] = useState(false)

  const postLoginAndGoChat = usePostLoginAndGoChat()

  async function onClickConnect() {
    setLoginReqIsLoading(true)
    await postLoginAndGoChat({
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    })
    setLoginReqIsLoading(false)
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
          {loginReqIsLoading && <LoadingSpinnerInBtn />}
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
    </div>
  )
}

export default LoginFormIndex
