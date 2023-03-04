import { ModalContext } from '../Contexts/ModalContext'
import Dialog from '../Atoms/Dialog/Dialog'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import { useContext, useState, useRef } from 'react'

function InfoModal() {
  const [open, setOpen] = useState(false)
  const [modalProps, setModalProps] = useState({})

  const { infoRef } = useContext(ModalContext)
  const resolveRef = useRef(() => {})

  infoRef.current = (props) =>
    new Promise((resolve) => {
      setModalProps(props)
      setOpen(true)
      resolveRef.current = resolve
    })

  function onClickValidation(event) {
    event.preventDefault()
    resolveRef.current('essai')
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} role="alertdialog">
        <div
          className={`m-auto shadow rounded p-3 bg-white border border-${
            modalProps?.styleOption ? modalProps.styleOption : 'primary'
          } border-5`}
        >
          {modalProps?.title && <h2>{modalProps?.title}</h2>}
          {modalProps?.message && (
            <p
              className={
                modalProps?.styleOption && `text-${modalProps.styleOption}`
              }
            >
              {modalProps?.message}
            </p>
          )}
          {modalProps?.errMessage && (
            <p className="text-danger">{modalProps?.errMessage}</p>
          )}
          <ButtonPrimary onClick={onClickValidation} isAutoFocus={true}>
            Ok
          </ButtonPrimary>
        </div>
      </Dialog>
    </>
  )
}

export default InfoModal
