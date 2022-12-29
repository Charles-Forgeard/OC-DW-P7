import UserContext from './UserContext.jsx'
import UserOptionsMenu from './UserOptionsMenu'
import useToggle from './useToggle.jsx';
import socket from '../index.js'

import React, { useState, useContext, createRef, useEffect, useRef} from 'react';
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

    function onClickDisconnectionLink(event){
        event.preventDefault()
        socket.emit('rejected', 'ping')
        window.location = window.location.origin
    }

    function onClickToggleUserOptionsMenu(event){
        event.preventDefault()
        console.log('click')
        render(<UserContext.Provider value={user}><UserOptionsMenu onClickCloseMenu={onClickCloseUserOptionsMenu}/></UserContext.Provider>,document.querySelector('#userOptionsMenu'))
    }

    function onClickCloseUserOptionsMenu(event){
        event.preventDefault()
        userMenu.current.focus()
        render(null,document.querySelector('#userOptionsMenu'))
    }

    return <div className="position-relative dropdown" aria-label="Menu Utilisateur" onClick={onClickToggleMenu}>
        <button className="p-0 bg-transparent border-0 d-block" ref={userMenu}>
            <picture aria-hidden={true} className="avatar-picture d-block">
                <img className="avatar-img rounded-1" 
                    src={avatar_picture_url} 
                    alt={`${user.firstname} ${user.name} picture id`} 
                    />
            </picture>
        </button>
        {showMenu && <nav onMouseLeave={toggleMenu} className={`d-block position-absolute top-100 end-0 bg-white rounded border border-primary shadow dropdown-menu`}>
            <ul className="p-0">
                <li className="dropdown-item"><a href="#" ref={firstItem} onClick={onClickToggleUserOptionsMenu} className="text-decoration-none">{user.is_admin ? 'Action administrateur' : 'Paramètres utilisateur'}</a></li>
                <li className="dropdown-item" onBlur={toggleMenu}><a href="#" onClick={onClickDisconnectionLink} className="text-decoration-none">Déconnection</a></li>
            </ul>
        </nav>}
    </div>
}

export default UserMenu