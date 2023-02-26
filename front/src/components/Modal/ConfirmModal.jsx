import { ModalContext } from '../Contexts/ModalContext'
import Dialog from '../Atoms/Dialog/Dialog'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import ButtonTertiary from '../Atoms/Btn/TertiaryBtn'
import { useContext, useState, useRef } from 'react'

function ConfirmModal() {
  const [open, setOpen] = useState(false)
  const [modalProps, setModalProps] = useState({})

  const { confirmRef } = useContext(ModalContext)
  const resolveRef = useRef(() => {})

  confirmRef.current = (props) =>
    new Promise((resolve) => {
      setModalProps(props)
      setOpen(true)
      resolveRef.current = resolve
    })

  function onClickConfirm(event) {
    event.preventDefault()
    resolveRef.current(true)
    setOpen(false)
  }

  function onClickCancel(event) {
    event.preventDefault()
    resolveRef.current(false)
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} role="alertdialog">
        <div
          className={`m-auto shadow rounded p-3 bg-white border border-primary border-5`}
        >
          {modalProps?.title && <h2>{modalProps?.title}</h2>}
          {modalProps?.message && <p>{modalProps?.message}</p>}
          <ButtonPrimary onClick={onClickConfirm} className="me-3">
            Confirmer
          </ButtonPrimary>
          <ButtonTertiary onClick={onClickCancel} isAutoFocus={true}>
            Annuler
          </ButtonTertiary>
        </div>
      </Dialog>
    </>
  )
}

export default ConfirmModal
