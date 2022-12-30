import Input from './input'
import InputPassword from './InputPassword'
import AlertDiv from './AlertDiv'
import useToggle from './useToggle'
import Dialog from './Dialog'
import ButtonPrimary from './ButtonPrimary'
import ButtonTertiary from './ButtonTertiary'
import {useRef,useState,useEffect, Fragment} from 'react'
import {createPortal} from 'react-dom'

function LoginFormIndex(){

    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)

    const [messageResponseModal,setMessageResponseModal] = useState('')
    const [showResponseModal, toggleResponseModal] = useToggle(false)
    const [isFailedLogin, setFailedLogin] = useState(false)

    function onClickConnect(){
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInputRef.current.value,
                password: passwordInputRef.current.value
            })
        }
        fetch(window.location.origin + '/auth/login', fetchOptions)
        .then(res => res.json())
        .then(({message}) =>{
            if(message === 'User account is active'){
                window.location = `${window.location.origin}/chat/`
            }else if(message === 'access denied'){
                setMessageResponseModal(messageResponseModal => "Identifiant et/ou mot de passe incorrect(s)")
                setFailedLogin(isFailedLogin => true)
                toggleResponseModal()
            }else{
                setMessageResponseModal(messageResponseModal => message)
                setFailedLogin(isFailedLogin => false)
                toggleResponseModal()
            }
        })
        .catch(err => {console.error(err)})
    }

    function onClickNewPasswordRequest(event){
        event.preventDefault()
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInputRef.current.value
            })
        }
        fetch(`${window.location.origin}/auth/alertAdmin`, fetchOptions)
            .then(res=>res.json())
            .then(res=>{
                setMessageResponseModal(messageResponseModal => res.message)
                toggleResponseModal()
            })
    }

    // function onClickRegisterUser(event){
    //     event.preventDefault()
    //     if(newPassword !== confirmNewPassword){
    //         setAlertSpanContent(alertSpanContent => 'Les deux mots de passe de sont pas identiques')
    //     }else{
    //         let fetchOptions = {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 email: emailInputRegisterRef.current.value,
    //                 password: newPassword
    //             })
    //         }
    //         fetch(window.location.origin + '/auth/register', fetchOptions)
    //         .then(async res => {
    //             if(res.status >= 400){
    //                 const response = await res.json()
    //                 return Promise.reject(response.message)
    //             }
    //         })
    //         .then(() =>{
    //             let fetchOptions = {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({
    //                     email: emailInputRegisterRef.current.value,
    //                     password: newPassword
    //                 })
    //             }
    //             return fetch(window.location.origin + '/auth/login', fetchOptions)
    //             .then(res => res.json())
    //             .then(({message}) =>{
    //                 if(message === 'User account is active'){
    //                     window.location = `${window.location.origin}/chat/`
    //                 }else if(message === 'access denied'){
    //                     setMessageResponseModal(messageResponseModal => "Identifiant et/ou mot de passe incorrect(s)")
    //                     toggleResponseModal()
    //                 }else{
    //                     setMessageResponseModal(messageResponseModal => message)
    //                     toggleResponseModal()
    //                 }
    //             })
    //         })
    //         .catch(err => {
    //             setMessageResponseModal(messageResponseModal => err.message ? err.message : err)
    //             toggleResponseModal()
    //         })
    //     }
    // }
    

    function onClickToggleResponseModal(event){
        event.preventDefault()
        toggleResponseModal()
        passwordInputRef.current.focus()
    }

    return <Fragment>
                <form class="col col-12 col-sm-6 col-md-5 col-lg-4 mx-auto shadow rounded p-3 bg-white">
                    <Input refInput={emailInputRef} label='Email' type='email' placeholder='Inscrivez votre adresse email' required={true}/>
                    <InputPassword refInput={passwordInputRef} type='password' label='Mot de passe' placeholder='Inscrivez votre mot de passe' required={true}/>
                    <ButtonPrimary onClick={onClickConnect}>Se connecter</ButtonPrimary>
                </form>
                {showResponseModal && createPortal(
                    <Dialog open={true} role="alertdialog">
                        <div className="m-auto shadow rounded p-3 bg-white border border-primary border-3">
                            <p>{messageResponseModal}</p>
                            {isFailedLogin && <ButtonTertiary onClick={onClickNewPasswordRequest}>Demander un nouveau Mot de passe</ButtonTertiary>}
                            <ButtonPrimary onClick={onClickToggleResponseModal} isAutoFocus={true}>Ok</ButtonPrimary>
                        </div>
                    </Dialog>, document.querySelector('#modalContainer'))}
        </Fragment>
}

export default LoginFormIndex



 /* <div class="input-group mb-1">
                <input 
                type="password" 
                class="form-control bg-opacity-50" 
                id='passwordLoginInput' 
                name="password" 
                required aria-required="true" 
                placeholder="Inscrivez votre mot de passe" 
                pattern="(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                validationMessage="test de message d'erreur"/>
                <button class="input-group-text eye-show-password eye-icon-hide bg-primary" aria-label="rendre le mot de passe visible" aria-pressed="false"></button>
            </div> */