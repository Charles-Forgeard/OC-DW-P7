import Dialog from '../Atoms/Dialog/Dialog'
import LoginForm from '../Login/LoginForm'
import { ModalContext } from '../Contexts/ModalContext'
import { SocketContext } from '../Contexts/SocketContext'
import LoadingSpinner from '../Atoms/Spinner/LoadingSpinner'
import useModal from '../../hooks/useModal'

import { useState, useRef, useContext, useEffect } from 'react'

function SecondLoginModal() {
  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const { info } = useModal()

  const logEmail = useRef(null)
  const logPassword = useRef(null)

  const { secondLoginRef } = useContext(ModalContext)
  const socket = useContext(SocketContext)

  const resolveRef = useRef(() => {})

  useEffect(() => {
    socket?.on('user:secondLogin', async (isValid) => {
      setLoading(false)
      if (!isValid) {
        await info({
          title: "Echec de l'anthentification",
          errMessage:
            "Veuillez vérifier vos identifiants. Si le problème persiste, merci de contacter l'administrateur.",
          styleOption: 'danger',
        })
      }
      resolveRef.current(isValid)
    })
    return () => socket?.off('user:secondLogin')
  }, [socket, resolveRef])

  secondLoginRef.current = () =>
    new Promise((resolve) => {
      console.log('secondLoginRef')
      setOpen(true)
      resolveRef.current = resolve
    })

  function onClickLogin(event) {
    event.preventDefault()
    console.log({
      email: logEmail.current.value,
      password: logPassword.current.value,
    })
    socket.emit('user:secondLogin', {
      email: logEmail.current.value,
      password: logPassword.current.value,
    })
    setOpen(false)
    logEmail.current.value = ''
    logPassword.current.value = ''
    setLoading(true)
  }

  function onCancel(event) {
    event.preventDefault()
    setOpen(false)
    logEmail.current.value = ''
    logPassword.current.value = ''
    resolveRef.current(undefined)
  }

  return (
    <>
      {isLoading && (
        <Dialog open={true}>
          <LoadingSpinner className="m-auto" size={8} />
        </Dialog>
      )}
      <Dialog open={open}>
        <div className="m-auto bg-white p-3 border border-3 border-primary rounded">
          <h6>Confirmation d&apos;identité requise</h6>
          <LoginForm
            refInputEmail={logEmail}
            refInputPassword={logPassword}
            action={onClickLogin}
            onCancel={onCancel}
          />
        </div>
      </Dialog>
    </>
  )
}

export default SecondLoginModal
