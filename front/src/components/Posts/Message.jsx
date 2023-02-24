import PictureLink from '../Atoms/Picture/PictureLink.jsx'
import MessageLikeBtn from './MessageLikeBtn.jsx'
import AvatarPicture from '../Atoms/Picture/AvatarPicture.jsx'
import MessageOptionsToggleMenu from './MessageOptionsToggleMenu.jsx'
import formatToLocalDate from '../../utils/formatToLocalDate.js'
import useToggle from '../../hooks/useToggle.jsx'
import React, { useRef, useEffect, useState } from 'react'
import ButtonTertiary from '../Atoms/Btn/TertiaryBtn'
import { host, apiPort } from '../../../config'

function Message({ message, dispatchModalState, user }) {
  console.log(message)

  const [isSpanOptions, showSpanOptions] = useState(false)
  const [isOptionsSpanTextToggled, toggleSpanOptionsText] = useToggle(false)

  const local_creation_date = formatToLocalDate(message.creation_date)

  const amendDate = message.amend_date
    ? formatToLocalDate(message.amend_date)
    : null

  const span = useRef(null)
  const container = useRef(null)

  useEffect(() => {
    if (span.current.getClientRects().length > 4) {
      showSpanOptions(true)
    }
  }, [])

  function onClickSetSpanOptions(event) {
    event.preventDefault()
    toggleSpanOptionsText()
  }

  const defaultAvatarPicture = '../img/person.svg'
  const userIsAuthor = message.author_id === user.id
  const authorPicture =
    message.author_profile_picture_url === 'default_url_avatar_picture'
      ? defaultAvatarPicture
      : `${host}:${apiPort}/private/${message.author_profile_picture_url}`
  const userPicture =
    user.profile_picture_url === 'default_url_avatar_picture'
      ? defaultAvatarPicture
      : `${host}:${apiPort}/private/${user.profile_picture_url}`

  return (
    <li
      className="d-flex gap-3 position-relative shadow-lg p-3 mb-5 rounded bg-white"
      tabIndex="0"
    >
      {console.log(`message ${message.id} rendu`)}
      <AvatarPicture
        src={userIsAuthor ? userPicture : authorPicture}
        className="col-1"
      />
      <div className="d-flex gap-3 flex-column">
        <div>
          <h5
            className="fs-5 pe-5"
            aria-label={`Post publié par ${message.author_name} ${message.author_firstname}`}
          >
            {userIsAuthor ? user.name : message.author_name}{' '}
            {userIsAuthor ? user.firstname : message.author_firstname}
          </h5>
          <span className="d-inline-block ms-1 fs-6">
            - Publié le {local_creation_date.date} à {local_creation_date.time}
          </span>
          <span className="d-inline-block ms-1 fs-6">
            {amendDate && `- Modifié le ${amendDate.date} à ${amendDate.time}`}
          </span>
        </div>

        <p
          className="position-relative fs-6"
          ref={container}
          style={{
            overflow: 'hidden',
            maxHeight: isOptionsSpanTextToggled ? 'unset' : '96px',
          }}
        >
          <span ref={span}>{message.text_content}</span>
          {isSpanOptions && (
            <>
              <ButtonTertiary
                className="position-absolute bottom-0 end-0 py-0"
                onClick={onClickSetSpanOptions}
              >
                {isOptionsSpanTextToggled ? 'Voir moins' : '... Voir plus'}
              </ButtonTertiary>
            </>
          )}
        </p>
        <div className="d-flex flex-wrap gap-3">
          <MessageLikeBtn message={message} />
        </div>
        <div className="d-flex flex-wrap align-items-center gap-3">
          {Object.keys(message.pictures).map((pictureId) => {
            const url = message.pictures[pictureId]
            return (
              <PictureLink
                url={`${host}:${apiPort}/private/${url}`}
                key={parseInt(pictureId)}
                id={pictureId}
              />
            )
          })}
        </div>
      </div>
      {user.is_admin || userIsAuthor ? (
        <MessageOptionsToggleMenu
          message={message}
          dispatchModalState={dispatchModalState}
        />
      ) : null}
    </li>
  )
}

export default React.memo(Message)
