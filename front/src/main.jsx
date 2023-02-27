import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginFormIndex from './components/Login/LoginFormIndex'
import ActivateAccountForm from './components/ActivateAccount/ActivateAccountForm'
import SignUpForm from './components/SignUp/SignUpForm'
import Header from './components/Header'
import Posts from './components/Posts'
import UserMenu from './components/UserMenu/UserMenu'
import ToggleLink from './components/Atoms/Router/ToggleLink'
import CreatePostForm from './components/Posts/CreatePost/CreateMessageForm'
import UpdatePostForm from './components/Posts/UpdatePost/UpdatePostForm'
import UserOptionsMenu from './components/UserMenu/UserOptions/UserOptionsMenu'
import AdminOptionsMenu from './components/UserMenu/AdminOptions/AdminOptionsMenu'
import { GetUserContext } from './components/Contexts/UserContext'
import { ProvideModalContext } from './components/Contexts/ModalContext'
import socket from './socket/socket'
import './style/bootstrap.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProvideModalContext>
        <Header linkTo="/" />
      </ProvideModalContext>
    ),
    children: [
      { path: '', element: <LoginFormIndex /> },
      { path: 'signUp', element: <SignUpForm /> },
      {
        path: 'activeUserAccount',
        element: <ActivateAccountForm />,
      },
    ],
  },
  {
    path: 'chat',
    loader: socket,
    element: (
      <GetUserContext>
        <ProvideModalContext>
          <Header linkTo="/chat">
            <ToggleLink to="createPost">Éditer post</ToggleLink>
            <UserMenu />
          </Header>
          {/*Outlet goes inside Header component, outside header tag*/}
          <Posts />
        </ProvideModalContext>
      </GetUserContext>
    ),
    children: [
      { path: 'createPost', element: <CreatePostForm /> },
      { path: 'updatePost', element: <UpdatePostForm /> },
      { path: 'user', element: <UserOptionsMenu /> },
      { path: 'admin', element: <AdminOptionsMenu /> },
    ],
  },
])

root.render(
  <React.StrictMode>
    <ProvideModalContext>
      <RouterProvider router={router} />
    </ProvideModalContext>
  </React.StrictMode>
)
