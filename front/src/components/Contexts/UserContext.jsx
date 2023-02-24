import { createContext, useState, useEffect } from 'react'
import { SocketContext } from './SocketContext'
import { useLoaderData } from 'react-router-dom'
import Dialog from '../Atoms/Dialog/Dialog'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import LoadingSpinner from '../Atoms/Spinner/LoadingSpinner'

export const UserContext = createContext({})

export const GetUserContext = ({ children }) => {
  const [userDef, setUserDef] = useState()

  const [isLoading, setLoading] = useState(true)

  const socket = useLoaderData()

  useEffect(() => {
    socket.on('user_def', (user) => {
      console.log(user)
      user ? setUserDef({ ...user }) : setUserDef(false)
      setLoading(false)
    })
    return () => {
      socket.off('user_def')
    }
  }, [socket])

  return (
    <>
      {!userDef ? (
        isLoading ? (
          <div className="d-flex justify-content-center">
            <LoadingSpinner size={8} />
          </div>
        ) : (
          <Dialog open={userDef ? false : true} role="alertdialog">
            <div className="m-auto shadow rounded p-3 bg-white border border-primary border-3">
              <h5>Access Denied</h5>
              <p>Utilisateur non identifié</p>
              <ButtonPrimary
                onClick={() => {
                  window.location = window.location.origin
                }}
                isAutoFocus={true}
              >
                Ok
              </ButtonPrimary>
            </div>
          </Dialog>
        )
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
