import Input from '../Atoms/Input/Input'
import InputPassword from '../Atoms/Input/InputPassword'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import ButtonTertiary from '../Atoms/Btn/TertiaryBtn'
import AlertDiv from '../Atoms/AlertDiv'

function LoginForm({
  refInputEmail,
  refInputPassword,
  action,
  errMessage,
  className,
  inputIdKeyword,
  onCancel = () => {},
}) {
  return (
    <form className={className} method="dialog">
      <Input
        id={`${inputIdKeyword ?? ''}_logEmail`}
        label="Email"
        type="email"
        placeholder="Email utilisateur"
        refInput={refInputEmail}
      />
      <InputPassword
        id={`${inputIdKeyword ?? ''}_logPassword`}
        label="Mot de passe"
        type="password"
        placeholder="Mot de passe utilisateur"
        refInput={refInputPassword}
      ></InputPassword>
      {errMessage && <AlertDiv>{errMessage}</AlertDiv>}
      <ButtonPrimary type="submit" className="me-3" onClick={onCancel}>
        Annuler
      </ButtonPrimary>
      <ButtonTertiary type="submit" onClick={action}>
        Confirmer
      </ButtonTertiary>
    </form>
  )
}

export default LoginForm
