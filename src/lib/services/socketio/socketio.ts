import { io, type SocketOptions } from 'socket.io-client'
import { socketStore } from './socketio.store'
import { get } from 'svelte/store'

export async function connectSocketIO(url: string, opts: SocketOptions) {
  console.log('Connection to socket.io server...')
  const socket = io(url.trim(), {...opts});
  await new Promise((resolve, reject) => {
    socket.on('connect_error', (err) => {
      socketStore.set(null)
      reject(err)
    })
    socket.on('connect', () => {
      socketStore.set(socket)
      resolve(true)
    })
  })
  console.log('Socket connected')
  socket.on('disconnect', () => {
    socketStore.set(null)
  })
  return socket  
}

export async function disconnectSocketIO() {
  const socket = get(socketStore)
  socket?.disconnect()  
}
