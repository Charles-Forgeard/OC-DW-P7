import MessagesContainer from './MessagesContainer'
import LoadingSpinner from '../Atoms/Spinner/LoadingSpinner'
import { getMsgs } from '../../api/MsgAPI'
import {
  reducer as msgReducer,
  initialState,
} from '../../hooks/useMessageReducer'
import Dialog from '../Atoms/Dialog/Dialog'
import ButtonPrimary from '../Atoms/Btn/PrimaryBtn.jsx'
import {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
  useReducer,
} from 'react'
import useModal from '../../hooks/useModal'

// Todo delete reducer logic after useModal is fully implemented
const initValue = () => {
  return { modal: null, message: null, scrollYPos: undefined }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'openModal':
      console.log(JSON.stringify(action))
      return { ...state, modal: action.modal, message: action.message }
    case 'setScrollYPos':
      console.log(JSON.stringify(action))
      return { ...state, scrollYPos: action.scrollYPos }
    case 'reset':
      console.log(JSON.stringify(action))
      return initValue()
    default:
      console.error(
        `arg.type (= ${action.type}) passé à la fonction dispatchModalState() incorrect.\n=> Les valeurs acceptées sont: 'openModal' | 'setScrollYPos' | 'reset'\n=> Exemple: dispatchModalState({type: 'openModal', modal: 'response', message: 'Exemple de texte de modal'})`
      )
      return initValue()
  }
}

function Posts() {
  const [state, dispatch] = useReducer(msgReducer, initialState)

  const intersectorObject = useRef(null)

  // Todo delete reducer logic after useModal is fully implemented
  const [modalState, dispatchModalState] = useReducer(reducer, initValue)
  const { info } = useModal()

  const [isLoading, setLoading] = useState(false)

  const [fetchAllowed, setFetchPermission] = useState(true)

  const options = useMemo(() => {
    return {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    }
  }, [])

  async function wait(millisec) {
    return new Promise((resolve) => setTimeout(resolve, millisec))
  }

  const fetchGetMessages = useCallback(async () => {
    if (fetchAllowed) {
      setLoading(true)
      await wait(1000)
      try {
        //state.nbMessages
        const response = await getMsgs({ offset: state.nbMessages })
        if (response.error) throw response.error
        const data = response.data
        console.log(data)
        if (data.errorMessage) throw data.errorMessage
        if (data.messages.length) {
          console.log('dispatch')
          dispatch({ type: 'addMessages', payload: data.messages })
        }
        if (data.messages.length < 10) {
          intersectorObject.current = null
          setFetchPermission(false)
        }
      } catch (err) {
        console.error(err)
        setFetchPermission(false)
        info({
          title: 'Nouveaux posts',
          errMessage:
            "Échec du chargement des nouveaux posts. Si le problème persiste, merci de contacter l'administrateur",
          styleOption: 'danger',
        })
      }
      setLoading(false)
    }
  }, [state.nbMessages, dispatch, fetchAllowed])

  const secondCallBackFunction = useCallback(
    async (entries) => {
      if (entries[0].isIntersecting) {
        await fetchGetMessages()
        console.log('Intersecting')
      }
    },
    [fetchGetMessages]
  )

  const observer = useMemo(
    () => new IntersectionObserver(secondCallBackFunction, options),
    [secondCallBackFunction, options]
  )

  useEffect(() => {
    const currentTarger = intersectorObject.current
    if (currentTarger) {
      observer.observe(currentTarger)
    }

    return () => {
      if (currentTarger) {
        observer.unobserve(currentTarger)
      }
    }
  }, [intersectorObject, options, secondCallBackFunction, observer])

  return (
    <div className="mt-5">
      <ul className="p-0">
        <MessagesContainer
          state={state}
          dispatch={dispatch}
          modalState={modalState}
          dispatchModalState={dispatchModalState}
        ></MessagesContainer>
      </ul>
      <div
        ref={intersectorObject}
        className={`${isLoading && fetchAllowed ? 'd-none' : ''}`}
      ></div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <LoadingSpinner size={8} />
        </div>
      ) : (
        'derniers posts chargés'
      )}
      {
        // Todo delete reducer logic after useModal is fully implemented
      }
      {modalState.modal === 'response' && (
        <Dialog open={true} role="alertdialog">
          <div className="m-auto shadow rounded p-3 bg-white border border-primary border-3">
            <p>{modalState.message}</p>
            <ButtonPrimary isAutoFocus={true}>Ok</ButtonPrimary>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default Posts
