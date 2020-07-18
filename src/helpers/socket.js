import io from "socket.io-client"
import { apiUrl } from "./fetch"

const socket = io(apiUrl, {
   reconnection: true,
   reconnectionDelay: 500,
   reconnectionDelayMax: 5000,
   reconnectionAttempts: Infinity,
   transports: ["websocket", "polling"],
   secure: true,
   rejectUnauthorized: false,
   forceNew: false,
   timeout: 60000,
})

export default socket
