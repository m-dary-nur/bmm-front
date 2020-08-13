<script>
   import { goto } from "@sveltech/routify"
   import Cookies from "js-cookie"
   import Fa from "svelte-fa"
   import { faBars, faBell, faUser, faSignOut, faCommentExclamation } from "@fortawesome/pro-regular-svg-icons"

   import { showSidebar, unsetSession, client, branch, personal } from "../stores"
   import { initlist, users } from "../stores/data"
   import fetch from "../helpers/fetch"

   let showUser = false
   let showNotification = false

   const logout = async () => {
      await fetch.post(`/logout`).then(res => {
         if (res.success) {            
            Cookies.remove("my-session")
            unsetSession()
            initlist.set([])
            users.set([])
            $goto("/login")
         } else {
            console.log("[logout]",res.message)
         }
      })
   }
</script>

<div class="w-full h-12 flex justify-between items-center z-30 px-2">
   <div class="flex">
      <button
         on:click={() => showSidebar.set(!$showSidebar)}
         on:blur={() => window.innerWidth < 768 ? setTimeout(() => showSidebar.set(false), 200) : null}
         class="md:mx-2 h-10 w-10 flex justify-center items-center cursor-pointer border-0 rounded-full hover:bg-gray-300 hover:text-theme"
      >
         <Fa icon={faBars} class="text-theme" />
      </button>
      <div
         on:click={() => $goto("/")}
         class="flex items-center md:px-0 px-2 leading-snug md:pl-4 cursor-pointer select-none"
      >
         <h3 class="font-bold text-lg pr-2">{$client.name}</h3>
      </div>
   </div>
   <div class="flex flex-row-reverse md:flex-row">
      <div class="flex justify-end">
         <button on:click={() => $goto("/feedback")} class="md:mx-1 h-10 w-10 flex justify-center items-center cursor-pointer border-0 rounded-full hover:bg-gray-300 hover:text-yellow-600">
            <Fa icon={faCommentExclamation} class="text-red-500" />
         </button>
         <button
            on:click={() => showNotification = !showNotification}
            on:blur={() => showNotification = false}
            class="md:mx-1 h-10 w-10 flex justify-center items-center cursor-pointer border-0 rounded-full hover:bg-gray-300 hover:text-yellow-600"
         >
            <Fa icon={faBell} class="text-theme" />
            <div class="relative">
               <div class="absolute mt-8" style="right: -10px">
                  {#if showNotification}
                     <div class="animate-slide-in-down flex flex-col py-2 bg-white shadow border-gray-400 rounded cursor-default">
                        <div class="px-6 py-4 text-left text-gray-500 whitespace-no-wrap cursor-default">
                           Tidak ada pemberitahuan.
                        </div>
                     </div>
                  {/if}
               </div>
            </div>
         </button>
         <button
            on:click={() => showUser = !showUser}
            on:blur={() => showUser = false}
            class="md:mx-1 px-4 h-10 flex justify-center items-center cursor-pointer border-0 rounded-lg hover:bg-gray-300 hover:text-theme"
         >
            <Fa icon={faUser} class="text-theme" /> <span class="hidden md:block md:pl-2">{$personal.name}</span>
            <div class="relative z-50">
               <div class="absolute mt-8 text-gray-600 hover:text-gray-600" style="right: -15px">
                  {#if showUser}
                     <div class="animate-slide-in-down flex flex-col py-2 bg-white shadow border-gray-400 rounded">
                        <div class="px-6 py-2 cursor-not-allowed opacity-50 hover:bg-gray-100 text-left hover:text-theme whitespace-no-wrap" title="coming soon">
                           <faBars name="cog" class="text-yellow-500" /> Preferensi
                        </div>
                        <div
                           on:click={logout}
                           class="flex items-center px-6 py-2 hover:bg-gray-100 text-left hover:text-theme whitespace-no-wrap"
                        >
                           <Fa icon={faSignOut} class="text-red-500 pr-2" /> Keluar
                        </div>
                     </div>
                  {/if}
               </div>
            </div>
         </button>
      </div>
   </div>
</div>