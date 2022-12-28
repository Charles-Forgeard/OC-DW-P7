import PictureLink from './PictureLink.jsx'
import React, {Fragment, useRef, useState} from 'react';
import socket from '../index.js'
import InputFilePicture from './InputFilePicture.jsx'

function UpdateMessageForm({message}){
    const avatar_picture_url = message.author_profile_picture_url === 'default_url_avatar_picture' ? 'img/person.svg' : message.author_profile_picture_url
    const amend_date_string = message.amend_date ? `- Modifié le ${message.amend_date}` : ''
    const creationDate_In_MS = new Date(message.creation_date * 1000)
    const local_creation_date = `${creationDate_In_MS.toLocaleDateString()} à ${creationDate_In_MS.toLocaleTimeString()}`
    const picturesComp = message.pictures.map(
        picture=>{ return <PictureLink url={picture.url} key={picture.id} pictureId={picture.id} onClick={onClickPictureToDelete}></PictureLink>}
        )
    const [picturesToDelete, setPicturesToDelete] = useState([])
    const [picturesCompInView, setPicturesInView] = useState(picturesComp)
    const [filesToSend, setFilesToSend] = useState([])

    const textarea = useRef(null)
    const picturesView = useRef(null)

    function onClickUpdateMsg(event){
        console.log({id: message.id, text_content: textarea.current.value, picturesToDelete: picturesToDelete, files : filesToSend})
        if(textarea.current.value !== message.text_content || picturesToDelete.length || filesToSend.length){
            socket.emit('msg:update', {id: message.id, text_content: textarea.current.value, picturesToDelete: picturesToDelete, files : filesToSend})
        }
    }

    function onClickPictureToDelete(event){
        event.preventDefault()
        console.log('PictureId: ',event.target.id)
        setPicturesToDelete(picturesToDelete => [...picturesToDelete, {id: event.target.id, url: event.target.src}])
    }

    return <div className="carte bg-white m-auto shadow rounded p-3 border border-primary border-3">
        {console.log('render: UpdateMessageForm')}
        <picture className="avatar-picture">
            <img src={avatar_picture_url} alt="" className="avatar-img rounded-3"/>
        </picture>
        <form className="carte_body"  method="dialog">
            <h5>{message.author_name} {message.author_firstname}<span className="carte_date_publication">- Publié le {local_creation_date}</span><span className="carte_date_modification">{amend_date_string}</span></h5>
            <textarea ref={textarea} defaultValue={message.text_content} className="carte_message form-control clamp-text-overflow">
            </textarea>
            <InputFilePicture picturesView={picturesView} filesToSend={filesToSend} setFilesToSend={setFilesToSend} setPicturesInView={setPicturesInView}/>
            <div className="carte_images">
                {picturesCompInView}
            </div>
            <button className="btn btn-primary fw-bold w-100 mt-3">Annuler</button>
            <button className="btn btn-tertiary text-secondary mt-3 d-block fw-bold w-100" onClick={onClickUpdateMsg}>Confirmer</button>
        </form>
    </div>
}

export default UpdateMessageForm