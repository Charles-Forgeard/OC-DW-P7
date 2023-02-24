import LikeHeartSvg from '../Atoms/Icons/LikeHeartSvg.jsx'
import { SocketContext } from '../Contexts/SocketContext'

import React, { useContext } from 'react'

function MessageLikeBtn({ message }) {
  const socket = useContext(SocketContext)

  function onlikesClickSendLike(event) {
    event.preventDefault()
    socket.emit('msg:like', message.id)
  }

  return (
    <div className="d-inline-block position-relative">
      <button
        href="#"
        onClick={onlikesClickSendLike}
        className="border-0 bg-transparent p-0"
        aria-label="Like post"
        aria-pressed={message.liked_by_user ? true : false}
      >
        <LikeHeartSvg color={message.liked_by_user ? 'red' : '#FFD7D7'} />
      </button>
      {message.likes && message.likes > 0 ? (
        <div className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-tertiary text-secondary">
          {message.likes}
        </div>
      ) : null}
    </div>
  )
}

export default React.memo(MessageLikeBtn)
