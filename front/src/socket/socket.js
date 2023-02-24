import { io } from 'socket.io-client'
import { host, apiPort } from '../../config'

const socket = () =>
  io(`${host}:${apiPort}/socket/`, {
    path: '/socket/',
    closeOnBeforeunload: false,
    withCredentials: true,
  })

export default socket
