import SignUp from './SignUp'
import { Link } from 'react-router-dom'
import usePostLoginAndGoChat from '../../hooks/usePostLoginAndGoChat'

function SignUpForm() {
  const postLoginAndGoChat = usePostLoginAndGoChat()
  return (
    <div className="d-flex gap-3 flex-wrap mt-5">
      <form className="col col-12 col-sm-6 col-md-5 col-lg-4 mx-auto shadow rounded p-3 bg-white">
        <SignUp callback={postLoginAndGoChat}>
          <Link
            to=".."
            className="btn btn-tertiary text-secondary fw-bold mt-3 me-3 w-100"
          >
            Annuler
          </Link>
        </SignUp>
      </form>
    </div>
  )
}

export default SignUpForm
