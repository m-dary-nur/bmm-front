<script>
   import { goto } from "@sveltech/routify"
   import Cookies from "js-cookie"
   import Fa from "svelte-fa"
   import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons"
   
   import { appname, setSession } from "../stores"
   import fetch from "../helpers/fetch"
   import { toast } from "../components/toast"
   import Checkbox from "../components/inputs/Checkbox.svelte"
   
   let form = {
      username: "",
      password: "",
      remember: true,
   }
   let loading = false

   const handleEnter = e => {
      if (e.keyCode === 13) {
         document.getElementById("password").focus()
      }
   }

   const handleSubmit = e => {
      if (form.username && form.username !== "" && form.password && form.password !== "" && e.keyCode === 13) {
         handleLogin()
      }
   }

   const handleLogin = async () => {
      loading = true
      await fetch.post(`/login`, form).then(res => {
         loading = false
         if (res.success) {
            if (form.remember) {
               localStorage.setItem("remember", JSON.stringify({ code: form.code, username: form.username, remember: true }))
            }
            Cookies.set("my-session", res.data.token)
            setSession(res.data)
            $goto("/")
         } else {
            toast.warning("Kesalahan", res.message)
         }
      })
   }
</script>

<svelte:head>
	<title>Masuk | {$appname}</title>
</svelte:head>

<div class="h-screen bg-blue-100 flex justify-center items-center">   

   <div class="w-full sm:w-full md:w-2/3 xl:w-6/12 mx-6 md:mx-6 py-10 flex flex-col md:flex-row md:justity-between items-center bg-white border border-gray-300 rounded-lg shadow-lg">
      <div class="md:block w-4/6 md:w-1/2 px-8 py-4">
         <img src="images/login.svg" alt="login" class="w-full" />
      </div>
      <div class="w-full md:w-1/2 px-8 py-4 md:border-l border-gray-300">
         <h3 class="px-2 pb-2 text-theme text-2xl font-bold">Masuk</h3>

         <div class="flex flex-col-reverse py-4">
            <!-- svelte-ignore a11y-autofocus -->
            <input 
               id="username"
               bind:value={form.username} 
               on:keydown={handleEnter}
               class="px-4 py-2 leading-7 border border-gray-300 rounded-lg focus:border-theme transition-colors duration-300" 
               placeholder="nama pengguna" 
               spellcheck="false"
               autofocus
               autocomplete="off" 
            />
         </div>
         <div class="flex flex-col-reverse py-4">
            <input 
               id="password"
               type="password"
               bind:value={form.password} 
               on:keydown={handleSubmit}
               class="px-4 py-2 leading-7 border border-gray-300 rounded-lg focus:border-theme transition-colors duration-300" 
               placeholder="password" 
               spellcheck="false"               
               autocomplete="off" 
            />
         </div>
         <div class="flex justify-between items-center py-4">
            <Checkbox label="Ingat saya" bind:checked={form.remember} />
            <button
               on:click={handleLogin}
               type="button"
               disabled={!form.username || form.username === "" || !form.password || form.password === ""}
               class={`${loading ? "opacity-50 bg-theme" : "hover:bg-theme hover:text-white"} px-4 py-2 text-theme border border-theme rounded-lg transition-colors duration-300`}
            >
               {#if loading}
               <div class="relative">
                  <div class="absolute w-full flex justify-center">
                     <Fa icon={faSpinnerThird} size="lg" class="text-white spin" />
                  </div>
               </div>
               {/if}Masuk
            </button>
         </div>
      </div>
   </div>

</div>