import Dialog from './Dialog.jsx'
import useToggle from './useToggle.jsx'
import socket from '../index.js'
import ConfirmForm from './ConfirmForm.jsx'
import UpdateMessageForm from './UpdateMessageForm.jsx'


import React, {Fragment} from 'react';
import {createPortal} from 'react-dom';

function MessageOptionsToggleMenu({message}){

    const [showMenu, toggleMenu] = useToggle(false)
    const [showUpdateModal, toggleUpdateModal] = useToggle(false)
    const [showDeleteModal, toggleDeleteModal] = useToggle(false)
   

    function onClickToggleMenu(event){
        event.preventDefault()
        toggleMenu()
    }

    function onClickToggleDeleteModal(event){
        event.preventDefault()
        toggleMenu()
        toggleDeleteModal()
    }

    function onClickToggleUpdateModal(event){
        event.preventDefault()
        toggleMenu()
        toggleUpdateModal()
    }

    function onClickDeleteMsg(event){
        event.preventDefault()
        socket.emit('msg:delete', message.id)
    }

    return <Fragment>
                <div className={`msg-toggle-menu dropdown`} tabIndex="0">
                
                <div onClick={onClickToggleMenu} className="ellipsis-icon rounded-circle m-1"></div>
                
                {showMenu &&
                    <ul onMouseLeave={onClickToggleMenu} className={`MessageOptionsToggleMenu d-block dropdown-menu`}>
                    <li><button className="dropdown-item" onClick={onClickToggleDeleteModal}>Supprimer message</button></li>
                    <li><button className="dropdown-item" onClick={onClickToggleUpdateModal}>Modifier message</button></li>
                    </ul>}

                </div>

                {showDeleteModal && createPortal(
                <Dialog open={true} onClose={toggleDeleteModal}>
                    <ConfirmForm title="Suppression du post" action={onClickDeleteMsg}/>
                </Dialog>, document.querySelector('#modalContainer'))}

                {showUpdateModal && createPortal(
                <Dialog open={true} onClose={toggleUpdateModal}>
                    <UpdateMessageForm message={message}/>
                </Dialog>, document.querySelector('#modalContainer'))}
            </Fragment>
}

export default MessageOptionsToggleMenu