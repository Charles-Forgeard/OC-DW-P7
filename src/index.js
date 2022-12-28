import React, { useState, useContext, useEffect, useCallBack, Fragment } from 'react';
import { render } from 'react-dom';
import MessagesContainer from './components/MessagesContainer.jsx';
import UserContext from './components/UserContext.jsx';
import UserMenu from './components/UserMenu.jsx';
import Message from './components/Message.jsx';
import { io } from "socket.io-client"

const sendMsgBtn = document.querySelector('#sendMsgBtn');
const msgInput = document.querySelector('#msgInput');
const imgInput = document.querySelector('#img-input');
const msg_view = document.querySelector('#msg_view');
const invalidMsgSpan = document.querySelector('#invalidMsgSpan');
const attendees_view = document.querySelector('#attendees_view');
const header_btns = document.querySelector('#header-btns');
const loading_msg_btn = document.querySelector('#loading-msg-btn');
const userOptionsMenu = document.querySelector('#userOptionsMenu');
const modalContainer = document.querySelector('#modalContainer');

let msgLimit = 10;
let messages = [];

const socket = io(`${window.location.origin}/socket/`, { 
    path: "/socket/",
    closeOnBeforeunload: false
})

export default socket;

socket.on('user_def', user_def=>{
    console.log('user_def: ', user_def)
    render(<UserContext.Provider value={user_def}><UserMenu/></UserContext.Provider>, header_btns)
    const observer = new IntersectionObserver((entries)=>{
        console.log(entries)
        if(entries[0].isIntersecting){
            fetch(`${window.location.origin}/chat/lastMsg?limit=${msgLimit}&offset=${messages.length}`)
                .then(response=>response.json())
                .then(response=>{
                    console.log('msg_count: ', messages.length)
                    console.log('response: ', response)
                    // response.messages.sort((a,b)=>{
                    //     return b.creation_date - a.creation_date
                    // })
                    if(response.messages.length >= msgLimit){
                        response.messages.forEach(message => {
                            message.user_id = user_def.id
                            message.user_is_admin = user_def.is_admin
                            createMsgComponents(message)
                        });
                    }else if(0 < response.messages.length < msgLimit){
                        response.messages.forEach(message => {
                            message.user_id = user_def.id
                            message.user_is_admin = user_def.is_admin
                            createMsgComponents(message)
                        });
                        functiondisconnect_observer()
                        loading_msg_btn.querySelectorAll('.spinner-border')[0]?.classList.add('d-none')
                        loading_msg_btn.innerText = 'Message le plus ancien atteint'
                    }
      
                    renderMsgComponents(user_def)
                    
                })
        }
    })
    observer.observe(loading_msg_btn)

    function functiondisconnect_observer(){
        observer.disconnect()
    }
})

socket.on('rejected', ()=>{
    console.log('rejected')
    socket.disconnect()
    window.location = window.location.origin
})

sendMsgBtn.addEventListener('click', (event)=>{
    event.preventDefault();
        const text_content = msgInput.value
        if(!text_content){
            invalidIds({
                alertSpan: invalidMsgSpan,
                message: 'Le texte du message ne doit pas être vide',
                inputsToInvalidate: [msgInput]
            })
        }else{
            let msg = filesToSend.length > 0 ? {text_content: text_content, files: filesToSend} : {text_content: msgInput.value}
            socket.emit('msg:create', msg);
            console.log('message sent: ', msg)
            msgInput.value = '';
            imgInput.value = '';
            imgInput.files = null;
            filesToSend = [];
            img_input_viewer.innerHTML = '';
            msgInput.focus();
        }
})

function invalidIds({alertSpan,message,anchor,inputsToInvalidate,turnValid=false}){
    for(const input of inputsToInvalidate){
        if(turnValid){
            input.classList.remove('is-invalid')
            alertSpan.classList.add('d-none')
        }else{
            if(!input.classList.contains('is-invalid')){
                input.classList.add('is-invalid')
            }
        }
    }
    if(!turnValid){
        if(message) alertSpan.innerText=message
        alertSpan.classList.remove('d-none')
        inputsToInvalidate.pop().focus()
    }
}



/**
 * Création d'un élément html contenant le message sous forme de string passée en paramètre
 * puis insertion dans le DOM comme enfant de la div #msg_view + scroll to bottom.
 * @param   {String}  msg  message à afficher à l'utilisateur
 */
function createMsgComponents(message, options){
    if(options?.insert === 'start'){
        // messages.unshift(msg_component)
        messages = [<Message message={message} key={message.id}/>, ...messages]
    }else{
        // messages.push(msg_component)
        messages = [...messages, <Message message={message} key={message.id}/>]

    }
}


function renderMsgComponents(user_def){
    render(<UserContext.Provider value={user_def}><MessagesContainer>{messages}</MessagesContainer></UserContext.Provider>, document.querySelector('#msg_view'))
}

// function add_attendees({id, name, firstname}){
//     const p = document.createElement('p')
//     p.className = `id${id} attendee` 
//     p.innerText = `${firstname} ${name}`
//     attendees_view.appendChild(p)
// }

// function delete_attendees(id){
//     const attendee = document.querySelector(`.id${id}`)
//     if(attendee){attendees_view.removeChild(attendee)}
// }

// socket.on('attendees', ({mouvement, id, name, firstname})=>{
//     mouvement === 'join' ? add_attendees({id, name, firstname}) : delete_attendees(id)
// })

const img_input_viewer = document.getElementById('img-input-viewer')
const form_msg = document.getElementById('form-msg')

let filesToSend = [];

let fileId = 0

imgInput.addEventListener('change', function (event){
    event.preventDefault()
    console.log('input event')
    let { files } = event.target

    for(let i =0; i < files.length; i++){

        const file = event.target.files[i]
        const customFile ={
            localId: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            buffer: file
        }
        filesToSend.push(customFile)
        

        const img = document.createElement('img')
        img.className = 'imgPreview'
        img.src = URL.createObjectURL(file)
        img.id = fileId

        fileId++

        img.addEventListener('click', event=>{
            event.preventDefault()
            const newData = new DataTransfer()
            for (let i = 0; i < filesToSend.length; i++) {
                if (filesToSend[i].localId != img.id){
                    newData.items.add(filesToSend[i].buffer)
                }else{
                    filesToSend = filesToSend.filter(customFile => customFile.localId != img.id)
                }
            }
            imgInput.files = newData.files // Assign the updates list
            img.remove()
        })
        img_input_viewer.appendChild(img)
    }

    const data = new DataTransfer
    filesToSend.forEach(file => data.items.add(file.buffer))
    imgInput.files = data.files
})

//dropzone
// form_msg.addEventListener('drop', event=>{
//     event.preventDefault()
//     event.stopPropagation();
//     const file = event.dataTransfer.files[0]
//     const customFile = {
//         name: file.name,
//         type: file.type,
//         size: file.size,
//         buffer: file
//     }
//     filesToSend.push(customFile)
//     console.log('File(s) dropped => ondrop');
//     console.log('file = ', customFile)
//     let img = document.createElement('img')
//     img.className = 'imgPreview'
    

//     let reader = new FileReader();
//     reader.onload = (function(img) { return function(e) { img.src = e.target.result; }; })(img);
//     reader.readAsDataURL(file);

//     img_input_viewer.appendChild(img)
// })

// form_msg.addEventListener('dragover', event=>{
//     event.preventDefault()
//     event.stopPropagation();
//     console.log('File(s) dropped => ondragover');
// })
//dropzone

msgInput.addEventListener('keyup', event=>{
    event.preventDefault()
    if(msgInput.value && msgInput.classList.contains('is-invalid')){
        invalidIds({ 
            alertSpan: invalidMsgSpan,
            inputsToInvalidate: [msgInput],
            turnValid: true })
    }
})

socket.on('msg:delete', (message_id)=>{
    console.log(message_id)
    messages = messages.filter(msg => msg.key != message_id)
    console.log(messages)
})

document.addEventListener('click', event=>{
    console.log('click on document')
})

document.addEventListener('wheel', event=>{
    console.log('wheel on document')
})
