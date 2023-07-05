import Message from './Message.jsx'
import { useEffect, Fragment, useContext } from 'react'
import { SocketContext } from '../Contexts/SocketContext'
import { UserContext } from '../Contexts/UserContext'
import useModal from '../../hooks/useModal'

function MessagesContainer({ state, dispatch, dispatchModalState }) {
  const socket = useContext(SocketContext)
  const user = useContext(UserContext)

  const { info } = useModal()

  useEffect(() => {
    socket.on('msg:create', async ({ status, message, initBy, errMessage }) => {
      console.log('socket.on msg:create', {
        status,
        message,
        initBy,
        errMessage,
      })
      if (!errMessage) dispatch({ type: 'addMessage', payload: message })
      if (initBy === user.id && errMessage)
        await info({
          title: 'Echec création du post',
          errMessage: `${errMessage}. Si le problème persiste, merci de contacter l'administrateur.`,
          styleOption: 'danger',
        })
      console.log('await')
    })
    return () => socket.off('msg:create')
  }, [socket, dispatch, user.id])

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
        info({
          title: 'Mise à jour du post',
          message: 'mise à jour réussie',
          errMessage: errMessage,
          styleOption: errMessage ? 'danger' : 'success',
        })
    })
    return () => socket.off('msg:update')
  }, [socket, dispatch, user.id])

  useEffect(() => {
    socket.on('msg:delete', ({ status, message_id, initBy, errMessage }) => {
      console.log('socket.on msg:delete', {
        status,
        message_id,
        initBy,
        errMessage,
      })
      if (!errMessage)
        dispatch({ type: 'deleteMessage', payload: { id: message_id } })
      if (initBy === user.id)
        info({
          title: 'Suppression du post',
          message: 'Suppression réussie',
          errMessage: errMessage,
          styleOption: errMessage ? 'danger' : 'success',
        })
    })
    return () => socket.off('msg:delete')
  }, [socket, dispatch, user.id])

  useEffect(() => {
    socket.on('msg:like', ({ postID, operation, initBy, errMessage }) => {
      console.log({
        postID: postID,
        operation: operation,
        initBy: initBy === user.id,
        errMessage: errMessage,
      })
      if (!errMessage)
        dispatch({
          type: 'likeMessage',
          payload: {
            postID: postID,
            operation: operation,
            initByUser: initBy === user.id,
          },
        })
      if (initBy === user.id && errMessage) {
        info({
          title: 'Echec like du post',
          errMessage: `${errMessage}. Si le problème persiste, merci de contacter l'administrateur.`,
          styleOption: 'danger',
        })
      }
    })
    return () => socket.off('msg:like')
  }, [socket, dispatch, user.id])

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
    </Fragment>
  )
}

export default MessagesContainer
