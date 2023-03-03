import React, { useRef, useState, useContext, useEffect } from 'react'
import InputFilePicture from '../../Atoms/Input/InputFilePicture.jsx'
import { UserContext } from '../../Contexts/UserContext'
import { Link } from 'react-router-dom'
import AvatarPicture from '../../Atoms/Picture/AvatarPicture.jsx'
import ResizableTextarea from '../../Atoms/Textarea/ResizableTextarea'
import { SocketContext } from '../../Contexts/SocketContext'
import { host, apiPort } from '../../../../config'
import useModal from '../../../hooks/useModal'

function CreateMessageForm() {
  const user = useContext(UserContext)
  const socket = useContext(SocketContext)
  const { info } = useModal()

  const avatar_picture_url =
    user.profile_picture_url === 'default_url_avatar_picture'
      ? '../img/person.svg'
      : `${host}:${apiPort}/private/${user.profile_picture_url}`

  const [picturesCompInView, setPicturesInView] = useState([])

  const [filesToSend, setFilesToSend] = useState([])

  const textarea = useRef(null)

  function onClickSendMsg(event) {
    if (!textarea.current.value) {
      event.preventDefault()
      return info({
        title: 'Le post ne contient pas de texte',
        errMessage: 'Le post doit contenir du texte pour être publié.',
        styleOption: 'danger',
      })
    }
    socket.emit('msg:create', {
      text_content: textarea.current.value,
      files: filesToSend,
    })
  }

  return (
    <div
      className="bg-white mt-3 shadow-lg rounded d-flex w-100 gap-3 p-3 sticky-top overflow-scroll"
      style={{
        maxHeight: '70vh',
        resize: 'both',
      }}
    >
      {console.log('render: UpdateMessageForm')}
      <AvatarPicture width="36px" src={avatar_picture_url} />
      <form className="w-100" method="dialog">
        <h5>
          {user.name} {user.firstname}
        </h5>
        <ResizableTextarea
          textareaRef={textarea}
          placeholder="Inscrivez le texte du post ici..."
          className="w-100"
        />
        <InputFilePicture
          picturesComp={picturesCompInView}
          filesToSend={filesToSend}
          setFilesToSend={setFilesToSend}
          setPicturesInView={setPicturesInView}
        />
        <div className="d-flex flex-wrap gap-3">{picturesCompInView}</div>
        {picturesCompInView.length > 0 && (
          <p>Cliquez sur une image pour la supprimer.</p>
        )}
        <Link
          to=".."
          className="btn btn-tertiary text-secondary mt-3 me-3 fw-bold"
          onClick={onClickSendMsg}
        >
          Publier
        </Link>
        <Link
          to=".."
          className="btn btn-primary text-secondary fw-bold mt-3 me-3"
        >
          Annuler
        </Link>
      </form>
    </div>
  )
}

export default CreateMessageForm
