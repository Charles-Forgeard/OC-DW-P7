import { createContext, useRef } from 'react'

export const defaultFunction = () =>
  Promise.resolve('default result, check if ModalContext is accessible')

export const defaultNoModal = {
  infoRef: {
    current: defaultFunction,
  },
  confirmRef: {
    current: defaultFunction,
  },
  secondLoginRef: {
    current: defaultFunction,
  },
  // Todo: add others type of modal here
}

export const ModalContext = createContext(defaultNoModal)

export const ProvideModalContext = ({ children }) => {
  const infoRef = useRef(defaultFunction)
  const confirmRef = useRef(defaultFunction)
  const secondLoginRef = useRef(defaultFunction)
  // Todo: add others modalRef here and in provider value properties
  return (
    <ModalContext.Provider value={{ infoRef, confirmRef, secondLoginRef }}>
      {children}
    </ModalContext.Provider>
  )
}
