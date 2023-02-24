import { Outlet, Link } from 'react-router-dom'

function Header({ children, linkTo }) {
  return (
    <>
      <div className="sticky-top">
        <header className="container p-3 d-flex gap-3 justify-content-between align-items-center bg-white shadow-lg">
          <Link to={linkTo}>
            <picture className="w-30">
              <img
                className="w-100"
                src="../img/logo-groupomania.png"
                alt="Logo groupomania"
              />
            </picture>
          </Link>
          {children}
        </header>
        <Outlet />
      </div>
    </>
  )
}

export default Header
