import { useNavigate } from 'react-router-dom'
import { postLogin } from '../api/MsgAPI'

const usePostLoginAndGoChat = (
  setMessageResponseModal,
  toggleResponseModal
) => {
  const navigate = useNavigate()
  return async function PostLoginAndGoChat(payload) {
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
      case 'User account is not active':
        console.log('redirect')
        navigate('activeUserAccount', {
          state: { userEmail: payload.email, tempPassword: payload.password },
        })
        break
      default:
        setMessageResponseModal('Erreur interne')
        toggleResponseModal()
        console.error('Valeur inattendue en réponse du fetchLogin', {
          data,
          error,
        })
    }
  }
}

export default usePostLoginAndGoChat
