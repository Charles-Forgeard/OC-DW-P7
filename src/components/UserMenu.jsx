import UserContext from './UserContext.jsx'
import UserOptionsMenu from './UserOptionsMenu'
import useToggle from './useToggle.jsx';
import socket from '../index.js'

import React, { useState, useContext, createRef, useEffect, useRef, Fragment} from 'react';
import {render} from 'react-dom';

function UserMenu(){
    const user = useContext(UserContext)
    const avatar_picture_url = user.profile_picture_url === 'default_url_avatar_picture' ? 'img/person.svg' : user.profile_picture_url
    const [showMenu, toggleMenu] = useToggle(false)
    const firstItem = createRef()
    const userMenu = useRef(null)

    function onClickToggleMenu(event){
        event.preventDefault()
        toggleMenu()
    }

    useEffect(()=>{
        firstItem?.current?.focus()
    },[showMenu])

    function onBlurGoToFirstItem(event){
        event.preventDefault()
        firstItem?.current?.focus()
    }

    function onClickDisconnectionLink(event){
        event.preventDefault()
        socket.emit('rejected', 'ping')
        window.location = window.location.origin
    }

    function onClickToggleUserOptionsMenu(event){
        event.preventDefault()
        toggleMenu()
        render(<UserContext.Provider value={user}><UserOptionsMenu onClickCloseMenu={onClickCloseUserOptionsMenu}/></UserContext.Provider>,document.querySelector('#userOptionsMenu'))
    }

    function onClickCloseUserOptionsMenu(event){
        event.preventDefault()
        event.stopPropagation()
        userMenu.current.focus()
        render(null,document.querySelector('#userOptionsMenu'))
    }

    function onEscapeKeyToggleMenu(event){
        event.preventDefault();
        event.stopPropagation()
        if(event.code === 'Escape'){
            toggleMenu()
            userMenu.current.focus()
        }
    }

    function onEnterKeyClick(event){
        if(event.code !== 'Escape'){
            event.stopPropagation()
        }
    }


    return <Fragment>

        <button className="bg-transparent border-0 p-0" ref={userMenu} onClick={onClickToggleMenu} aria-haspopup="menu" aria-label="Paramètres Utilisateur" aria-expanded={showMenu}> 
            <picture aria-hidden={true} className="avatar-picture d-block">
                <img className="avatar-img rounded-1" 
                    src={avatar_picture_url} 
                    alt={`${user.firstname} ${user.name} picture id`} 
                    />
            </picture>
        </button>

        {showMenu && <ul className="p-0 d-block position-absolute top-100 end-0 bg-white rounded border border-primary shadow dropdown-menu" role="menu" onMouseLeave={toggleMenu} onKeyDown={onEscapeKeyToggleMenu}>
            <li className="dropdown-item" role="presentation">
                <a href="#" role="menuitem" onClick={onClickToggleUserOptionsMenu} ref={firstItem} className="text-decoration-none" onKeyDown={onEnterKeyClick}>{user.is_admin ? 'Action administrateur' : 'Paramètres utilisateur'}</a>
            </li>
            <li className="dropdown-item" role="presentation" onBlur={onBlurGoToFirstItem}>
                <a href="#" role="menuitem" onClick={onClickDisconnectionLink} className="text-decoration-none" onKeyDown={onEnterKeyClick}>Déconnection</a>
            </li>
        </ul>}
    </Fragment>
    
}

export default UserMenu