import { host, apiPort } from '../../config'

const getMsgsUrl = ({ limit, offset }) =>
  `${host}:${apiPort}/chat/lastMsg?limit=${limit}&offset=${offset}`

const postLoginUrl = () => `${host}:${apiPort}/auth/login`

const postRegisterUrl = () => `${host}:${apiPort}/auth/register`

const postActiveUserAccountUrl = () =>
  `${host}:${apiPort}/auth/activeUserAccount`

export { getMsgsUrl, postLoginUrl, postRegisterUrl, postActiveUserAccountUrl }
