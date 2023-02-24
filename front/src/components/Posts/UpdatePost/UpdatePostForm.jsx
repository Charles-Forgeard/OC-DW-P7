import PictureLink from '../../Atoms/Picture/PictureLink.jsx'
import { useRef, useState, useContext, useEffect } from 'react'
import InputFilePicture from '../../Atoms/Input/InputFilePicture.jsx'
import AvatarPicture from '../../Atoms/Picture/AvatarPicture.jsx'
import { useLocation, Link } from 'react-router-dom'
import { SocketContext } from '../../Contexts/SocketContext'
import ResizableTextarea from '../../Atoms/Textarea/ResizableTextarea'
import { host, apiPort } from '../../../../config'

function UpdateMessageForm() {
  const socket = useContext(SocketContext)

  let { state } = useLocation()
  const message = state.message
  const defaultAvatarPicture = '../img/person.svg'
  const avatar_picture_url =
    message.author_profile_picture_url === 'default_url_avatar_picture'
      ? defaultAvatarPicture
      : `${host}:${apiPort}/private/${message.author_profile_picture_url}`
  const amend_date_string = message.amend_date
    ? `- Modifié le ${message.amend_date}`
    : ''
  const creationDate_In_MS = new Date(message.creation_date * 1000)
  const local_creation_date = `${creationDate_In_MS.toLocaleDateString()} à ${creationDate_In_MS.toLocaleTimeString()}`
  const picturesComp = Object.keys(message.pictures).map((pictureId) => {
    const url = message.pictures[pictureId]
    return (
      <PictureLink
        url={`${host}:${apiPort}/private/${url}`}
        key={pictureId}
        id={pictureId}
        onClick={onClickPictureToDelete}
      />
    )
  })
  const [picturesToDelete, setPicturesToDelete] = useState([])
  const [picturesCompInView, setPicturesInView] = useState(picturesComp ?? [])
  const [filesToSend, setFilesToSend] = useState([])

  const textarea = useRef(null)

  const formRef = useRef(null)

  const [formRefYpoS, setFormYPos] = useState(0)

  useEffect(() => {
    setFormYPos(formRef.current.getBoundingClientRect().y)
    console.log(formRef.current.getBoundingClientRect().y)
  }, [])

  function onClickUpdateMsg() {
    console.log({
      id: message.id,
      text_content: textarea.current.value,
      picturesToDelete: picturesToDelete,
      files: filesToSend,
    })
    if (
      textarea.current.value !== message.text_content ||
      picturesToDelete.length ||
      filesToSend.length
    ) {
      console.log('setMsgUpdates')
      console.log('filesToSend= ' + JSON.stringify(filesToSend))
      socket.emit('msg:update', {
        id: message.id,
        text_content: textarea.current.value,
        picturesToDelete: picturesToDelete,
        files: filesToSend,
      })
    } else {
      //@todo com with user
    }
  }

  function onClickPictureToDelete(event) {
    event.preventDefault()
    console.log('PictureId: ', event.target.id)
    console.log('PictureId: ', event.target.src)
    setPicturesToDelete((picturesToDelete) => [
      ...picturesToDelete,
      { id: event.target.id, url: event.target.src },
    ])
  }

  return (
    <div
      className="bg-white mt-3 shadow-lg rounded d-flex w-100 gap-3 p-3 sticky-top overflow-scroll"
      style={{ top: formRefYpoS, maxHeight: '70vh', resize: 'both' }}
      ref={formRef}
    >
      {console.log('render: UpdateMessageForm')}
      <AvatarPicture width="36px" src={avatar_picture_url} />
      <form className="w-100" method="dialog">
        <h5>
          {message.author_name} {message.author_firstname}
        </h5>
        <span className="d-inline-block">
          - Publié le {local_creation_date}
        </span>
        <span className="d-inline-block">{amend_date_string}</span>
        <ResizableTextarea
          textareaRef={textarea}
          defaultValue={message.text_content}
          className="w-100"
        />
        <InputFilePicture
          picturesComp={picturesComp ?? []}
          setFilesToSend={setFilesToSend}
          setPicturesInView={setPicturesInView}
        />
        <div className="d-flex flex-wrap gap-3">{picturesCompInView}</div>
        <Link to=".." className="btn btn-primary text-white fw-bold mt-3 me-3">
          Annuler
        </Link>
        <Link
          to=".."
          className="btn btn-tertiary text-secondary mt-3 me-3 fw-bold"
          onClick={onClickUpdateMsg}
        >
          Publier modifications
        </Link>
      </form>
    </div>
  )
}

export default UpdateMessageForm
