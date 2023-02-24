import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

function ToggleLink({ to, origin = "", children }) {
  const initialState = false
  const [isActive, setActiveState] = useState(initialState)

  let location = useLocation()

  useEffect(() => {
    setActiveState((isActive) =>
      location.pathname.includes(to) ? !initialState : initialState
    )
  }, [location, initialState, to])

  return (
    <>
      <Link
        to={isActive ? origin : to}
        className={`d-block btn fw-bold text-secondary ${
          isActive ? 'btn-primary' : 'btn-tertiary'
        }`}
        onClick={() => {
          setActiveState((isActive) => !isActive)
        }}
      >
        {children}
      </Link>
    </>
  )
}

export default ToggleLink

//<Link
//   to={page}
//   onClick={togglePage}
//   ref={linkRef}
//   //state={{ linkRef: linkRef }}
//   className={`d-block btn ${page === to ? 'btn-tertiary' : 'btn-primary'}`}
// >
//   {children}
// </Link>
