import { UserContext } from '../Contexts/UserContext.jsx'
import useToggle from '../../hooks/useToggle.jsx'
import { SocketContext } from '../Contexts/SocketContext'
import onClickOutside from '../../hooks/useClickOutSide'
import { host, apiPort } from '../../../config'
import { useContext, createRef, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function UserMenu() {
  const socket = useContext(SocketContext)
  const user = useContext(UserContext)

  console.log(user)

  const [showMenu, toggleMenu, setShowMenu] = useToggle(false)
  const firstItem = createRef()
  const userMenu = useRef(null)

  function onClickToggleMenu(event) {
    event.preventDefault()
    toggleMenu()
  }

  useEffect(() => {
    firstItem?.current?.focus()
  }, [showMenu, firstItem])

  function onBlurGoToFirstItem(event) {
    event.preventDefault()
    firstItem?.current?.focus()
  }

  function onClickDisconnectionLink(event) {
    event.preventDefault()
    socket.emit('rejected', 'ping')
    window.location = window.location.origin
  }

  function onClickToggleUserOptionsMenu() {
    toggleMenu()
  }

  function onEscapeKeyToggleMenu(event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.code === 'Escape') {
      toggleMenu()
      userMenu.current.focus()
    }
  }

  function onEnterKeyClick(event) {
    if (event.code !== 'Escape') {
      event.stopPropagation()
    }
  }

  onClickOutside({
    elementId: 'header-btns',
    callback: () => {
      console.log('ici')
      setShowMenu((showMenu) => {
        console.log('showMenu ', showMenu)
        if (showMenu) {
          toggleMenu()
        }
        return showMenu
      })
    },
  })

  return (
    <nav className="position-relative d-flex m-0 gap-3">
      <button
        className="bg-transparent border-0 p-0"
        ref={userMenu}
        onClick={onClickToggleMenu}
        aria-haspopup="menu"
        aria-label="Paramètres Utilisateur"
        aria-expanded={showMenu}
      >
        <picture
          className="avatar-picture d-block"
          style={{ height: '64px', width: '64px' }}
        >
          <img
            aria-hidden={true}
            className="d-block w-100 h-100 object-fit-contain rounded-1"
            src={
              user.profile_picture_url === 'default_url_avatar_picture'
                ? '../img/person.svg'
                : `${host}:${apiPort}/private/${user.profile_picture_url}`
            }
            alt={`${user.firstname} ${user.name} picture id`}
          />
        </picture>
      </button>

      {showMenu && (
        <ul
          className="p-0 d-block position-absolute top-100 end-0 bg-white rounded border border-primary shadow dropdown-menu overflow-hidden "
          role="menu"
          onMouseLeave={toggleMenu}
          onKeyDown={onEscapeKeyToggleMenu}
          onBlur={console.log('blur')}
        >
          <li className="dropdown-item" role="presentation">
            <Link
              to={user.is_admin ? 'admin' : 'user'}
              role="menuitem"
              onClick={onClickToggleUserOptionsMenu}
              ref={firstItem}
              className="bg-transparent border-0 p-0 text-primary"
              onKeyDown={onEnterKeyClick}
            >
              {user.is_admin
                ? 'Action administrateur'
                : 'Paramètres utilisateur'}
            </Link>
          </li>
          <li
            className="dropdown-item"
            role="presentation"
            onBlur={onBlurGoToFirstItem}
          >
            <button
              role="menuitem"
              onClick={onClickDisconnectionLink}
              className="bg-transparent border-0 p-0 text-primary"
              onKeyDown={onEnterKeyClick}
            >
              Déconnection
            </button>
          </li>
        </ul>
      )}
    </nav>
  )
}

export default UserMenu
