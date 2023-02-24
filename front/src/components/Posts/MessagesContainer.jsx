import Message from './Message.jsx'
import Dialog from '../Atoms/Dialog/Dialog'
import ConfirmForm from '../Atoms/Form/ConfirmForm.jsx'
import React, { useEffect, Fragment, useContext } from 'react'
import { SocketContext } from '../Contexts/SocketContext'
import { UserContext } from '../Contexts/UserContext'

function MessagesContainer({
  state,
  dispatch,
  dispatchModalState,
  modalState,
}) {
  const socket = useContext(SocketContext)
  const user = useContext(UserContext)

  useEffect(() => {
    socket.on('msg:create', ({ status, message, initBy, errMessage }) => {
      console.log('socket.on msg:create', {
        status,
        message,
        initBy,
        errMessage,
      })
      if (!errMessage) dispatch({ type: 'addMessage', payload: message })
      if (initBy === user.id && errMessage)
        dispatchModalState({
          type: 'openModal',
          modal: 'response',
          message: errMessage,
        })
    })
    return () => socket.off('msg:create')
  }, [socket, dispatch, dispatchModalState, user.id])

  useEffect(() => {
    socket.on('msg:update', ({ status, updates, initBy, errMessage }) => {
      console.log('socket.on msg:update', {
        status,
        updates,
        initBy,
        errMessage,
      })

      if (!errMessage) dispatch({ type: 'updateMessage', payload: updates })
      if (initBy === user.id)
        dispatchModalState({
          type: 'openModal',
          modal: 'response',
          message: errMessage ?? 'mise à jour du post réussie',
        })
    })
    return () => socket.off('msg:update')
  }, [socket, dispatch, dispatchModalState, user.id])

  useEffect(() => {
    socket.on('msg:delete', ({ status, message_id, initBy, errMessage }) => {
      console.log('socket.on msg:update', {
        status,
        message_id,
        initBy,
        errMessage,
      })
      if (!errMessage)
        dispatch({ type: 'deleteMessage', payload: { id: message_id } })
      if (initBy === user.id)
        errMessage
          ? dispatchModalState({
              type: 'openModal',
              modal: 'response',
              message: errMessage,
            })
          : dispatchModalState({
              type: 'openModal',
              modal: 'response',
              message: 'Supression du message réussie',
            })
    })
    return () => socket.off('msg:delete')
  }, [socket, dispatch, dispatchModalState, user.id])

  useEffect(() => {
    socket.on('msg:like', ({ postID, operation, initBy, errMessage }) => {
      console.log({
        postID: postID,
        operation: operation,
        initBy: initBy,
        errMessage: errMessage,
      })
      if (!errMessage)
        dispatch({
          type: 'likeMessage',
          payload: { postID: postID, operation: operation, initBy: initBy },
        })
      if (initBy === user.id && errMessage) {
        dispatchModalState({
          type: 'openModal',
          modal: 'response',
          message: errMessage,
        })
      }
    })
    return () => socket.off('msg:like')
  }, [socket, dispatch, dispatchModalState, user.id])

  function onCloseModal(event) {
    event.preventDefault()
    dispatchModalState({ type: 'reset' })
  }

  function onClickDeleteMsg(event) {
    socket.emit('msg:delete', modalState.message.id)
  }

  return (
    <Fragment>
      {/* a chaque fois que messages va changer, la reconstruction se refait toute seule */}
      {Object.values(state.messages).map((message) => (
        <Message
          message={message}
          key={message.id}
          dispatch={dispatch}
          dispatchModalState={dispatchModalState}
          user={user}
        />
      ))}

      {modalState.modal === 'deleteModal' && (
        <Dialog open={true} onClose={onCloseModal}>
          <ConfirmForm title="Suppression du post" action={onClickDeleteMsg} />
        </Dialog>
      )}
    </Fragment>
  )
}

export default MessagesContainer
