import useToggle from '../../hooks/useToggle.jsx'
import EllipsisSvg from '../Atoms/Icons/EllipsisSvg'
import { Link } from 'react-router-dom'

function MessageOptionsToggleMenu({ message, dispatchModalState }) {
  const [showMenu, toggleMenu] = useToggle(false)

  function onClickToggleMenu(event) {
    event.preventDefault()
    toggleMenu()
  }

  function onClickShowDeleteModal(event) {
    event.preventDefault()
    dispatchModalState({
      type: 'openModal',
      modal: 'deleteModal',
      message: message,
    })
    toggleMenu()
  }

  function onClickShowUpdateMenu(event) {
    toggleMenu()
  }

  return (
    <div
      className={`position-absolute d-flex flex-column align-items-end top-0 end-0 dropdown`}
      tabIndex="0"
    >
      <EllipsisSvg
        role="button"
        onClick={onClickToggleMenu}
        className="d-block rounded-circle m-1"
      />

      {showMenu && (
        <ul
          // onMouseLeave={onClickToggleMenu}
          className="d-block dropdown-menu border-primary position-relative"
        >
          <li>
            <button
              className="dropdown-item text-primary"
              onClick={onClickShowDeleteModal}
            >
              Supprimer
            </button>
          </li>
          <li>
            <Link
              to="updatePost"
              state={{ message: message, sendMsgUpdates: 2 }}
              className="dropdown-item text-primary"
              onClick={onClickShowUpdateMenu}
            >
              Modifier
            </Link>
          </li>
        </ul>
      )}
    </div>
  )
}

export default MessageOptionsToggleMenu
