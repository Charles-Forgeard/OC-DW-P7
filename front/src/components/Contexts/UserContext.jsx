import { createContext, useState, useEffect } from 'react'
import { SocketContext } from './SocketContext'
import { useLoaderData } from 'react-router-dom'
import LoadingSpinner from '../Atoms/Spinner/LoadingSpinner'
import useModal from '../../hooks/useModal'

export const UserContext = createContext({})

export const GetUserContext = ({ children }) => {
  const [userDef, setUserDef] = useState()

  const [isLoading, setLoading] = useState(true)

  const socket = useLoaderData()

  const { info } = useModal()

  useEffect(() => {
    socket.on('rejected', async (reason) => {
      await info({
        title: 'Acces refusé',
        errMessage: `${reason}. Si le problème persiste. Merci de contacter l'administrateur.`,
        styleOption: 'danger',
      })
      window.location = window.location.origin
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
        await info({
          title: 'Acces refusé',
          errMessage:
            "Si le problème persiste. Merci de contacter l'administrateur.",
          styleOption: 'danger',
        })
        window.location = window.location.origin
      }
      user ? setUserDef({ ...user }) : setUserDef(false)
    })
    return () => {
      socket.off('user_def')
    }
  }, [socket])

  return (
    <>
      {!userDef ? (
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
