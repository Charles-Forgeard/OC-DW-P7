import Message from './Message.jsx'
import Dialog from './Dialog.jsx'
import ButtonPrimary from './ButtonPrimary.jsx'
import React, { useState, useEffect, Fragment } from 'react'
import {createPortal} from 'react-dom'
import useToggle from './useToggle'
import socket from '../index.js'

function MessagesContainer({children}){
    const msg = children
    const [messages, setMessages] = useState([]);

    const [showResponseModal, toggleResponseModal] = useToggle(false)
    const [messageResponseModal,setMessageResponseModal] = useState('')

    useEffect(()=>{
        setMessages(messages => msg)
    },[msg])

    function toggleResponseModalIfError(resStatus){
        if(resStatus && resStatus >= 400){
            switch(resStatus){
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
            return true
        }else{
            return false
        }
    }

    useEffect(()=>{
        socket.on('msg:create', ({status,message}) => {
            if(!toggleResponseModalIfError(status)){
                setMessages(messages => [
                    <Message message={message} key={message.id}/>,
                    ...messages
                    ]
                )
            }
        })
        return ()=>socket.off('msg:create')
    },[]);

    useEffect(()=>{
        socket.on('msg:update', ({status,message}) => {
            toggleResponseModalIfError(status)
        })
        return ()=>socket.off('msg:update')
    },[]);

    useEffect(()=>{
            socket.on('msg:delete' , ({status,message_id})=>{
                if(!toggleResponseModalIfError(status)){
                    setMessages(messages => messages.filter(messageComponent => messageComponent.key != message_id))
                }
        })
        return ()=>socket.off('msg:delete')
    },[])

    function onClickToggleResponseModal(event){
        event.preventDefault()
        toggleResponseModal()
    }

    return <Fragment>
        {messages}
        {showResponseModal && createPortal(
                    <Dialog open={true} role="alertdialog">
                        <div className="m-auto shadow rounded p-3 bg-white border border-primary border-3">
                            <p>{messageResponseModal}</p>
                            <ButtonPrimary onClick={onClickToggleResponseModal} isAutoFocus={true}>Ok</ButtonPrimary>
                        </div>
                    </Dialog>, document.querySelector('#modalContainer'))}
        </Fragment>
}

export default MessagesContainer