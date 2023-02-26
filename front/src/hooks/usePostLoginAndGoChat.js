import { useNavigate } from 'react-router-dom'
import { postLogin } from '../api/MsgAPI'
import useModal from './useModal'

const usePostLoginAndGoChat = () => {
  const { info } = useModal()

  const navigate = useNavigate()

  return async function PostLoginAndGoChat(payload) {
    const { data, error } = await postLogin(payload)

    console.log(data)

    if (error || data?.errorMessage || !data) {
      error ? console.error(error) : console.error(data)
      return info({
        title: 'Echec du login',
        errMessage: `${
          data?.errorMessage ?? 'Un incident inattendu est survenu'
        }. \n Si le problème persiste, merci de contacter l'administrateur`,
        stypeOption: 'danger',
      })
    }

    switch (data.message) {
      case 'User account is active':
        window.location = `${window.location.origin}/chat/`
        break
      case 'User account is not active':
        console.log('redirect')
        navigate('activeUserAccount', {
          state: { userEmail: payload.email, tempPassword: payload.password },
        })
        break
      default:
        info({
          title: 'Erreur interne',
          errMessage:
            "Un incident inattendu est survenu. Si le problème persiste, merci de contacter l'administrateur",
          stylePtion: 'danger',
        })
        console.error('Valeur inattendue en réponse du fetchLogin', {
          data,
        })
    }
  }
}

export default usePostLoginAndGoChat
