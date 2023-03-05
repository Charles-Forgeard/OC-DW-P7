import { createContext, useState, useEffect } from 'react'
import { SocketContext } from './SocketContext'
import { useLoaderData } from 'react-router-dom'
import LoadingSpinner from '../Atoms/Spinner/LoadingSpinner'
import Dialog from '../Atoms/Dialog/Dialog'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'

export const UserContext = createContext({})

export const GetUserContext = ({ children }) => {
  const [userDef, setUserDef] = useState()

  const [isLoading, setLoading] = useState(true)

  const socket = useLoaderData()

  const [disconnectModal, setDisconnecModal] = useState({
    visible: false,
    title: '',
    message: '',
  })

  function onClickGoToLoginPage(event) {
    event.preventDefault()
    window.location = window.location.origin
  }

  useEffect(() => {
    socket.on('rejected', async (reason) => {
      setDisconnecModal({
        visible: true,
        title: 'Acces refusé',
        message: `${reason}. Si le problème persiste. Merci de contacter l'administrateur.`,
      })
    })
    return () => {
      socket.off('rejected')
    }
  }, [socket, info])

  useEffect(() => {
    socket.on('user_def', async (user) => {
      console.log(user)
      setLoading(false)
      if (!user) {
        setDisconnecModal({
          visible: true,
          title: 'Acces refusé',
          message:
            "Si le problème persiste. Merci de contacter l'administrateur.",
        })
      }
      user ? setUserDef({ ...user }) : setUserDef(false)
    })
    return () => {
      socket.off('user_def')
    }
  }, [socket])

  return (
    <>
      {disconnectModal.visible ? (
        <Dialog open={true} role="alertdialog">
          <div
            className={`m-auto shadow rounded p-3 bg-white border border-danger border-5`}
          >
            <h2>{disconnectModal.title}</h2>
            <p className="text-danger">{disconnectModal.message}</p>
            <ButtonPrimary onClick={onClickGoToLoginPage} isAutoFocus={true}>
              Ok
            </ButtonPrimary>
          </div>
        </Dialog>
      ) : !userDef ? (
        <div className="d-flex justify-content-center">
          {isLoading && <LoadingSpinner size={8} />}
        </div>
      ) : (
        <SocketContext.Provider value={socket}>
          <UserContext.Provider value={userDef}>
            {children}
          </UserContext.Provider>
        </SocketContext.Provider>
      )}
    </>
  )
}
