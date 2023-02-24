import SignUp from './SignUp'
import { Link } from 'react-router-dom'
import useToggle from '../../hooks/useToggle'
import Dialog from '../Atoms/Dialog/Dialog'
import { useState } from 'react'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn'
import { postLogin } from '../../api/MsgAPI'

function SignUpForm() {
  const [messageResponseModal, setMessageResponseModal] = useState('')
  const [showResponseModal, toggleResponseModal] = useToggle(false)

  async function postLoginAndGoChat(payload) {
    const { data, error } = await postLogin(payload)

    console.log(data)

    if (error || data?.errorMessage || !data) {
      setMessageResponseModal(
        data?.errorMessage ? data?.errorMessage : 'Echec du login'
      )
      toggleResponseModal()
      return error ? console.error(error) : console.error(data?.errorMessage)
    }

    switch (data.message) {
      case 'User account is active':
        window.location = `${window.location.origin}/chat/`
        break
      case 'access denied':
        console.error('access denied')
        setMessageResponseModal('Identifiant et/ou mot de passe incorrect(s)')
        toggleResponseModal()
        break
      default:
        console.error('Valeur inattendue en réponse du fetchLogin', {
          data,
          error,
        })
    }
  }

  function signUpCallback(response) {
    if (response.errorMessage) {
      setMessageResponseModal(response.errorMessage)
      toggleResponseModal()
    } else {
      postLoginAndGoChat(response)
    }
  }

  function onClickToggleResponseModal(event) {
    event.preventDefault()
    toggleResponseModal()
  }

  return (
    <div className="d-flex gap-3 flex-wrap mt-5">
      <form className="col col-12 col-sm-6 col-md-5 col-lg-4 mx-auto shadow rounded p-3 bg-white">
        <SignUp
          callback={signUpCallback}
          setMessageResponseModal={setMessageResponseModal}
          toggleResponseModal={toggleResponseModal}
        >
          <Link
            to=".."
            className="btn btn-tertiary text-secondary fw-bold mt-3 me-3 w-100"
          >
            Annuler
          </Link>
        </SignUp>
      </form>
      {showResponseModal && (
        <Dialog open={true} role="alertdialog" center={true}>
          <div className="m-auto shadow rounded p-3 bg-white border border-primary border-3">
            <p>{messageResponseModal}</p>
            <ButtonPrimary
              onClick={onClickToggleResponseModal}
              isAutoFocus={true}
              className="w-100"
            >
              Ok
            </ButtonPrimary>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default SignUpForm
