import { createContext, useRef } from 'react'
import DisplayModal from '../Modal/DisplayModal'

export const defaultInfoFunction = () => Promise.resolve(true)

export const defaultNoModal = {
  infoRef: {
    current: defaultInfoFunction,
  },
  // Todo: add others type of modal here
}

export const ModalContext = createContext(defaultNoModal)

export const ProvideModalContext = ({ children }) => {
  const infoRef = useRef(defaultInfoFunction)
  // Todo: add others modalRef here and in provider value properties
  return (
    <>
      <ModalContext.Provider value={{ infoRef }}>
        {children}
        <DisplayModal />
      </ModalContext.Provider>
    </>
  )
}
