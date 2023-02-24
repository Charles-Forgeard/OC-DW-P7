import { useState } from 'react'

function useToggle(boolean) {
  const [isTrue, setBoolean] = useState(boolean ?? true)

  function toggle() {
    setBoolean((boolean) => !boolean)
  }

  return [isTrue, toggle, setBoolean]
}

export default useToggle
