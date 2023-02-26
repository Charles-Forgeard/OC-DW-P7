import { useContext, useCallback } from 'react'
import { ModalContext } from '../components/Contexts/ModalContext'

const useModal = () => {
  // Todo one ref by modal
  const { infoRef, confirmRef } = useContext(ModalContext)
  return {
    info: useCallback(
      (props) => {
        return infoRef.current(props)
      },
      [infoRef]
    ),
    confirm: useCallback(
      (props) => {
        return confirmRef.current(props)
      },
      [confirmRef]
    ),
    // Todo one prop confirm like by modal
  }
}

export default useModal
