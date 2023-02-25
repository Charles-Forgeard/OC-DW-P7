import { useContext, useCallback } from 'react'
import { ModalContext } from '../components/Contexts/ModalContext'

const useModal = () => {
  const { infoRef } = useContext(ModalContext)
  // Todo one ref by modal
  return {
    info: useCallback(
      (props) => {
        return infoRef.current(props)
      },
      [infoRef]
    ),
    // Todo one prop confirm like by modal
  }
}

export default useModal
