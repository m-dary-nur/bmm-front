import { get, writable } from "svelte/store"
import socket from "../helpers/socket"
import fetch from "../helpers/fetch"
import { toast } from "../components/toast"

export const initlist = writable([])

export const users = writable([])

const dataStore = {
   users,
}

export const getDataById = (table, id) => {
   const datas = get(dataStore[table])
   const data = datas.find(x => x.id === parseInt(id))
   if (!data) console.log("[getDataById] data not found")
   return data
}

export const init = async table => {
   const isDebug = true || process.env.NODE_ENV === "development"
   const list = get(initlist)
   const exist = list.findIndex(t => t === table)
   if (exist === -1) {
      initlist.update(state => [...state, table])
      socket.on(`stream ${table}`, e => {
         const payload = { key: "id", table, data: e.data }
         switch (e.event) {
            case "insert": {
               if (isDebug) console.log("[insert]", e)
               dataStore[table].update(state => [...payload.data, ...state])
               break
            }
            case "update": {
               if (isDebug) console.log("[update]", e)
               dataStore[table].update(state =>
                  state.map(x => {
                     const i = payload.data.findIndex(y => y.id === x[payload.key])
                     if (i !== -1) return { ...x, ...payload.data[i] }
                     return x
                  })
               )
               break
            }
            case "delete": {
               if (isDebug) console.log("[delete]", e)
               const dataId = payload.data.map(x => x.id)
               dataStore[table].update(state => state.filter(x => dataId.indexOf(x.id) === -1))
               break
            }
            default:
               return console.log("[store stream outhandled]")
         }
      })
      return await fetch.get(`/${table}`).then(res => {
         if (res.success) {
            dataStore[table].set(res.data)
         } else {
            toast.danger("kesalahan inisiasi data.", res.message)
         }
      })
   }
   return true
}
