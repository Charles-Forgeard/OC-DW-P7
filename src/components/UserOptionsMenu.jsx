import UserOptionsMenu_item from './UserOptionsMenuItem'
import Input from './Input.jsx'
import InputPassword from './InputPassword.jsx'
import FormBtn from './FormBtn.jsx'
import UserContext from './UserContext.jsx'
import AlertDiv from './AlertDiv.jsx'
import useToggle from './useToggle.jsx'
import socket from '../index.js'
import LoginForm from './LoginForm.jsx'
import Dialog from './Dialog'
import ButtonPrimary from './ButtonPrimary'

import React, {useRef, useContext, useState, useEffect} from 'react';
import {createPortal} from 'react-dom'

function UserOptionsMenu({onClickCloseMenu}){

    const user = useContext(UserContext)

    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setconfirmNewPassword] = useState('')

    const [alertSpanContent, setAlertSpanContent] = useState('')
    const [showConfirmUpdateModal, toggleShowConfirmUpdateModal] = useToggle(false)
    const [emailInputValue, setEmailInputValue] = useState('')
    const [showResponseModal, toggleResponseModal] = useToggle(false)
    const [messageResponseModal,setMessageResponseModal] = useState('')

    const nameInput = useRef(null)
    const firstnameInput = useRef(null)
    const newEmailInput = useRef(null)
    const logEmail = useRef(null)
    const logPassword = useRef(null)
    const confirmPasswordInput = useRef(null)

    function onKeyUpnewPasswordInput(event){
        event.preventDefault()
        console.log('newPassword: ' + event.target.value)
        setNewPassword(newPassword => event.target.value)
    }

    function onKeyUpConfirmNewPasswordInput(event){
        event.preventDefault()
        console.log('confirmNewPassword: ' + event.target.value)
        setconfirmNewPassword(confirmNewPassword => event.target.value)
    }

    function onKeyUpInputEmailValue(event){
        event.preventDefault()
        setEmailInputValue(emailInputValue => event.target.value)
    }

    function onBlurCheckPasswordInputs(event){
        event.preventDefault()
        if(newPassword === confirmNewPassword){
            setAlertSpanContent(alertSpanContent => "Le nouveau mot de passe n'est pas identique à sa confirmation")
            toggleResponseModal()
        }
    }

    function onClickShowConfirmModal(event){
        event.preventDefault()
        if(newPassword !== confirmNewPassword){
            setMessageResponseModal(messageResponseModal => "Le nouveau mot de passe n'est pas identique à sa confirmation")
            return toggleResponseModal()
        }
        console.log('newEmailInput', newEmailInput)
        console.log('nameInput', nameInput)
        console.log('firstnameInput', firstnameInput)


        console.log(`socket.emit('user:update', {toUpdate: 
            {
                name: ${nameInput?.current?.value}, 
                firstname: ${firstnameInput?.current?.value},
                newEmail: ${newEmailInput?.current?.value},
                email:  ${emailInputValue},
                newPassword: ${confirmNewPassword === newPassword ? newPassword : undefined}
            },
        
        login: {
            logEmail: ${logEmail?.current?.value},
            logPassword: ${logPassword?.current?.value}
        })`)
        toggleShowConfirmUpdateModal()
    }
 //{toUpdate: {name, firstname, email, password, profile_picture}, login : {logEmail, logPassword}}
    function onClickUpdateUser(event){
        socket.emit('user:update', 
        {toUpdate: 
            {
                name: nameInput?.current?.value, 
                firstname: firstnameInput?.current?.value,
                newEmail: newEmailInput?.current?.value, 
                email:  emailInputValue,
                newPassword: confirmNewPassword === newPassword ? newPassword : undefined
            },
        
        login: {
            logEmail: logEmail?.current?.value,
            logPassword: logPassword?.current?.value
        }
        })
        console.log(`socket.emit('user:update', {toUpdate: 
            {
                name: ${nameInput?.current?.value}, 
                firstname: ${firstnameInput?.current?.value},
                newEmail: ${newEmailInput?.current?.value},
                email:  ${emailInputValue}, 
                newPassword: ${confirmNewPassword === newPassword ? newPassword : undefined}
            },
        
        login: {
            logEmail: ${logEmail?.current?.value},
            logPassword: ${logPassword?.current?.value}
        })`)

    }

    function onClickToggleResponseModal(event){
        event.preventDefault()
        toggleResponseModal()
    }

    useEffect(()=>{
        const lastCharIndex = confirmNewPassword.length - 1
        const lastChar = confirmNewPassword[lastCharIndex]
        console.log(`lastCharIndex: ${lastCharIndex}, lastChar: ${lastChar}`)
        if(newPassword[lastCharIndex] !== lastChar){
            setAlertSpanContent(alertSpanContent => 'Cette lettre est différente du premier mot de passe.')
        }else{
            setAlertSpanContent(alertSpanContent => alertSpanContent === '' ? alertSpanContent : '')
        }
    },[confirmNewPassword])

    useEffect(()=>{
        socket.on('user:update', ({status})=>{
            switch(status){
                case 204:
                    setMessageResponseModal(messageResponseModal => 'Modification du compte réussie')
                    break;
                case 401:
                    setMessageResponseModal(messageResponseModal => 'Action non autorisée.')
                    break;
                case 500:
                    setMessageResponseModal(messageResponseModal => "La requete a rencontré une erreur. Si l'erreur ce reproduit, merci de contacter l'administrateur")
                    break;
                default:
                    setMessageResponseModal(messageResponseModal => "La requete a rencontré une erreur inattendue. Si l'erreur ce reproduit, merci de contacter l'administrateur")
            }
            toggleResponseModal()
        })

    },[])

    return <ul className="list-unstyled mb-0 border border-primary rounded p-3 pe-5 mb-3 d-flex flex-column gap-3 position-relative">
            <UserOptionsMenu_item title="Réinitialiser mot de passe" onSubmit={onClickShowConfirmModal} autoFocus={true}>
                {user.is_admin && <Input id='userEmailToInactivateInput' type='email' placeholder="name@example.com" label="Email de l'utilisateur" onKeyUp={onKeyUpInputEmailValue}/>}
                <InputPassword type='password' placeholder="new password" label={user.is_admin ? "Nouveau mot de passe temporaire" : "Nouveau mot de passe"} onKeyUp={onKeyUpnewPasswordInput}/>
                <InputPassword refInput={confirmPasswordInput} type='password' placeholder="new password" label="Confirmation mot du passe" onKeyUp={onKeyUpConfirmNewPasswordInput}/>
                {alertSpanContent && <AlertDiv>{alertSpanContent}</AlertDiv>}
                <FormBtn type="submit">{user.is_admin ? 'Réinitialiser' : 'Mise à jour'}</FormBtn>
            </UserOptionsMenu_item>
            {!user.is_admin ?
            <UserOptionsMenu_item title="Profil utilisateur" onSubmit={onClickShowConfirmModal}>
                <Input refInput={nameInput} type='text' placeholder="nom" label="Nom"/>
                <Input refInput={firstnameInput} type='text' placeholder="prénom" label="Prénom"/>
                <Input refInput={newEmailInput} type='email' placeholder="name@example.com" label="Email"/>
                <FormBtn type="submit">Mise à jour</FormBtn>
            </UserOptionsMenu_item> : null
            }
            <button aria-label="Close menu" type="button" className="btn bg-transparent position-absolute top-0 end-0" onClick={onClickCloseMenu}>
                    <span aria-hidden="true" className="fs-2">&times;</span>
            </button>
            {showConfirmUpdateModal && createPortal(
                <Dialog open={true} onClose={toggleShowConfirmUpdateModal}>
                    <LoginForm refInputEmail={logEmail} refInputPassword={logPassword} action={onClickUpdateUser} title={null} list={null}/>
                </Dialog>, document.querySelector('#modalContainer'))
            }
            {showResponseModal && createPortal(
                    <Dialog open={true} role="alertdialog">
                        <div className="m-auto shadow rounded p-3 bg-white border border-primary border-3">
                            <p>{messageResponseModal}</p>
                            <ButtonPrimary onClick={onClickToggleResponseModal} isAutoFocus={true}>Ok</ButtonPrimary>
                        </div>
                    </Dialog>, document.querySelector('#modalContainer'))}
        </ul>
}

export default UserOptionsMenu