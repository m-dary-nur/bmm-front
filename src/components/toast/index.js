import { writable } from "svelte/store"
import { faCheck, faExclamation, faTimes, faInfo } from "@fortawesome/pro-regular-svg-icons"

export let toaster = writable(null)

export let toast = {
   success: (title, message, option) => {
      const options = { ...option, icon: faCheck, iconColor: "text-green-500" }
      toaster.set({ title, message, ...options })
   },
   warning: (title, message, option) => {
      const options = { ...option, icon: faExclamation, iconColor: "text-yellow-500" }
      toaster.set({ title, message, ...options })
   },
   danger: (title, message, option) => {
      const options = { ...option, icon: faTimes, iconColor: "text-red-500" }
      toaster.set({ title, message, ...options })
   },
   info: (title, message, option) => {
      const options = { ...option, icon: faInfo, iconColor: "text-blue-500" }
      toaster.set({ title, message, ...options })
   },
}
