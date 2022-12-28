import PictureLink from './PictureLink.jsx'
import MessageLikeBtn from './MessageLikeBtn.jsx'
import MessageOptionsToggleMenu from './MessageOptionsToggleMenu.jsx'
import formatToLocaldate from './formatToLocalDate.js'
import useFormatDate from './useFormatDate'
import UserContext from './UserContext'
import socket from '../index.js'
import React, {Fragment, useEffect, useState, useContext} from 'react';

function Message({message}){

    const user = useContext(UserContext)

    const avatar_picture_url = message.author_profile_picture_url === 'default_url_avatar_picture' ? 'img/person.svg' : message.author_profile_picture_url
    const local_creation_date = formatToLocaldate(message.creation_date)
    let pictures_components = []

    if(message.pictures.length){
        pictures_components = message.pictures.map(picture=>{
            return <PictureLink url={picture.url} key={picture.id} id={picture.id}></PictureLink>
        })
    }

    const [picturesComps, setPicturesComps] = useState(pictures_components)

    const [amendDate, setAmendDate] = useFormatDate(message.amend_date)
    const [currentMessage, setCurrentMessage] = useState(message)

    useEffect(()=>{
        socket.on('msg:update', ({updates})=>{
            if(updates.id === message.id){
                console.log(updates)
                setCurrentMessage(message => {
                    let newMessage = message
                    console.log(newMessage)
                    if(updates.text_content !== message.text_content) newMessage = {...newMessage, text_content: updates.text_content}
                    if(updates.picturesIdToDelete.length){
                        newMessage.pictures = newMessage.pictures.filter(picture => {
                            return updates.picturesIdToDelete.indexOf(picture.id.toString()) === -1
                        })
                    }
                    if(updates.newPictures.length){
                        updates.newPictures.forEach(newPicture => newMessage.pictures.push(newPicture))
                    }
                    console.log(newMessage)
                    return newMessage
                })
                setAmendDate(updates.amend_date)
                setPicturesComps(picturesComps => {
                    let newPicturesComps = []
                    if(updates.picturesIdToDelete.length){
                        newPicturesComps = picturesComps.filter(PictureLink => updates.picturesIdToDelete.indexOf(PictureLink.key) === -1)
                    }else{
                        newPicturesComps = picturesComps
                    }
                    if(updates.newPictures.length) {
                        updates.newPictures.forEach(newPicture => {
                        newPicturesComps = [...newPicturesComps, <PictureLink url={newPicture.url} key={newPicture.id} id={newPicture.id}></PictureLink>]
                        })
                    }
                    return newPicturesComps
                })
            }
            
        })
        return ()=>socket.off('msg:update')
    },[])

    


    return <li className="carte" tabindex="0">
        <picture className="avatar-picture">
            <img src={avatar_picture_url} alt="" className="avatar-img rounded-3"/>
        </picture>
        <div className="carte_body">
            <div>
                <h5 className="pe-5" aria-label={`Post publié par ${message.author_name} ${message.author_firstname}`}>
                    {message.author_name} {message.author_firstname}
                </h5>
                <span className="carte_date_publication">- Publié le {local_creation_date.date} à {local_creation_date.time}</span>
                <span className="carte_date_modification">{amendDate && `- Modifié le ${amendDate.date} à ${amendDate.time}`}</span>
            </div>
            
            <p className="carte_message clamp-text-overflow">
                <span className="carte_message_text">
                    {currentMessage.text_content}
                </span>
                <a href="#" className="seeMore">... Voir plus</a>
                <a href="#" className="seeLess">Voir moins</a>
            </p>
            <div className="carte_btns">
                <MessageLikeBtn message={message}/>
            </div>
            <div className="carte_images">
                {picturesComps.length ? <Fragment>{picturesComps}</Fragment> : null}
            </div>
        </div>
        {user.is_admin || message.author_id === user.id ? <MessageOptionsToggleMenu message={currentMessage}/> : null}
    </li>
}

export default Message