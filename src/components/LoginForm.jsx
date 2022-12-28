import Input from './Input'
import InputPassword from './InputPassword'
import ButtonPrimary from './ButtonPrimary'
import ButtonTertiary from './ButtonTertiary'
import AlertDiv from './AlertDiv'

function LoginForm({refInputEmail,refInputPassword, action, errMessage}){
    return <form className="m-auto shadow rounded p-3 bg-white border border-primary border-3" method="dialog">
        <Input id='logEmail' label='email' type='email' placeholder='Email utilisateur' refInput={refInputEmail}/>
        <InputPassword id='logPassword' label='Mot de passe' type='password' placeholder='Mot de passe utilisateur' refInput={refInputPassword}></InputPassword>
        {errMessage && <AlertDiv>{errMessage}</AlertDiv>}
        <ButtonPrimary type='submit'>Annuler</ButtonPrimary>
        <ButtonTertiary type='submit' onClick={action}>Confirmer</ButtonTertiary>
    </form>
}

export default LoginForm