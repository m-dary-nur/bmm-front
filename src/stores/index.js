import { writable, get } from "svelte/store"
import socket from "../helpers/socket"

export let appname = writable("App Name")
export let logged = writable(false)
export let showSidebar = writable(true)
export let client = writable(null)
export let branch = writable(null)
export let personal = writable(null)
export let menu = writable(null)
export let menus = writable([])

export const setSession = data => {
   logged.set(true)
   client.set(data.client)
   branch.set(data.branch)
   personal.set(data.personal)
   menu.set(data.menu)
   menus.set(data.menus)

   socket.on("user connected", e => {
      if (process.env.NODE_ENV === "development") console.log("[user connected]", e)
      if (e.user === data.personal.id) {
         console.log("function still none, please add function for automated logout.")
      }
   })
   socket.on("data personal updated", e => {
      if (process.env.NODE_ENV === "development") console.log("data personal updated", e)
      if ("privileges" in e) {
         const allmenu = get(menus)
         const newMenu = allmenu.filter(x => x.parentId === 0 || e.privileges.indexOf(x.id) !== -1)
         menu.set(newMenu)
      }
      personal.update(old => ({ ...old, ...e }))
   })
   socket.on("reconnect", () => {
      socket.emit("user connected", { client: data.client.id, branch: data.branch.id, user: data.personal.id })
   })
   socket.on("user disconnected", e => console.log("[user disconnected]", e))
   socket.emit("user connected", { client: data.client.id, branch: data.branch.id, user: data.personal.id })
}

export const unsetSession = () => {
   logged.set(false)
   client.set(null)
   branch.set(null)
   personal.set(null)
   menu.set(null)
   menus.set([])
}
