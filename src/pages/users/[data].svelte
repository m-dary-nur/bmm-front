<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"
   import Fa from "svelte-fa"
   import { 
      faCogs,
      faBuilding,
      faUsers,
      faFile,
      faFileSignature,
      faInventory,
      faTruck,
      faBoxFull,
      faBoxes,
   } from "@fortawesome/pro-regular-svg-icons" 

	import { appname, menu, menus } from "../../stores"
   import { init, getDataById, users } from "../../stores/data"

   import diff from "../../helpers/diff"
   import fetch from "../../helpers/fetch"

   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
	import { toast } from "../../components/toast"
	import ButtonBack from "../../components/buttons/Back.svelte"
	import Button from "../../components/buttons/Primary.svelte"
	import Field from "../../components/inputs/Field.svelte"
	import Switch from "../../components/inputs/Switch.svelte"

   
   export let data

   const id = data === "new" ? null : data
   const action = data === "new" ? "add" : "edit"
	const initialState = {
      name: "",
		newPassword: "",
		password: "",
		email: "",
		phone: "",
		fullname: "",
		active: true,
   }
   
	let form = initialState
	let privileges = {}
   let loading = false

   const iconlist = {
      "cogs": faCogs,
      "building": faBuilding,
      "users": faUsers,
      "file": faFile,
      "file-signature": faFileSignature,
      "inventory": faInventory,
      "truck": faTruck,
      "box-full": faBoxFull,
      "boxes": faBoxes,
   }

   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1
   const modules = $menus.filter(x => x.parentId === 0)
   const subs = parentId => $menus.filter(x => x.parentId === parentId && x.action === "view")
   const groups = key => $menus.filter(x => x.key === key)
   const firstId = key => $menus.filter(x => x.key === key)[0].id

   const handleGroup = key => {
      const group = groups(key)      
      if (group.length > 0) {
         const firstId = group[0].id
         const newPrivileges = {}
         if (privileges[firstId]) {
            group.map(x => newPrivileges[x.id] = true)
         } else {
            group.map(x => newPrivileges[x.id] = false)
         }
         privileges = { ...privileges, ...newPrivileges }
      }
   }

   const insert = () => {
      loading = true
      let privilegeTransform = []
      Object.entries(privileges).map(([k, v]) => {
         if (v) {
            const id = parseFloat(k)
            privilegeTransform = [...privilegeTransform, id]
         }
         return true
      })      
      const privilegesString = JSON.stringify(privilegeTransform)
      const log = JSON.stringify({ ...form, privileges: privilegesString })      
      fetch.post(`/users`, { ...form, privileges: privilegesString, log }).then(res => {
         loading = false
         if (res.success) {
            form = initialState
            toast.success("Berhasil dibuat",res.message)
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

   const update = () => {
      loading = true
      const oldData = $users.find(x => x.id === form.id)
      let privilegeTransform = []
      Object.entries(privileges).map(([k, v]) => {
         if (v) {
            const id = parseFloat(k)
            privilegeTransform = [...privilegeTransform, id]
         }
         return true
      })      
      const privilegesString = JSON.stringify(privilegeTransform)
      const log = JSON.stringify(diff({ ...form, privileges: privilegesString }, oldData))
      fetch.put(`/users`, { ...form, privileges: privilegesString, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/users")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

	onMount(() => {
      init("users").then(() => {
         if (action === "edit") {
            const data = getDataById("users", id)
            form = { ...form, ...data }
            const privilegesAllows = {}
            const privParse = JSON.parse(data.privileges)
            privParse.map(x => {
               privilegesAllows[x] = true
               return true
            })
            privileges = { ...privileges, ...privilegesAllows }
         }
      })
   })
</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Pengguna | {$appname}</title>
</svelte:head>

{#if $menu && allow("users", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Pengguna</h3>
      <ButtonBack on:click={() => $goto("/users")} disabled={$menu && !allow("users", "view")} />
   </div> 
   <div class="w-full md:pt-2 md:px-6 scrolling-auto">
      <div class="w-full md:w-10/12 xl:w-8/12 md:pr-4 md:border-r border-gray-300">
         <form class="w-full">
            <div class="p-4">
               <h5 class="text-red-500 leading-relaxed">* nama pengguna tidak dapat diubah setelah dibuat.</h5>
            </div>
            <div class="flex flex-col md:flex-row">               
               <div class="control md:w-1/2">
                  <Field bind:value={form.name} disabled={id} />
                  <label>nama pengguna *</label>
               </div>					
               {#if action === "edit"}
               <div class="control md:w-1/2">
                  <Field type="password" bind:value={form.newPassword} />
                  <label>password baru</label>
               </div>
               {:else}
               <div class="control md:w-1/2">
                  <Field type="password" bind:value={form.password} />
                  <label>password *</label>
               </div>
               {/if}
            </div>
            <div class="control">
               <Field bind:value={form.fullname} />
               <label>nama lengkap *</label>
            </div>
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/2">
                  <Field bind:value={form.email} />
                  <label>email *</label>
               </div>
               <div class="control md:w-1/2">
                  <Field bind:value={form.phone} />
                  <label>nomor telepon *</label>
               </div>               
            </div>            
            <div>
               <h3 class="px-4 py-1 pt-4 text-theme-400 font-bold border-b border-gray-300 italic"># hak akses</h3>
               {#each modules as p}
                  <div class="flex flex-col">
                     <h3 class="flex items-center mx-4 mt-4 mb-2 font-semibold italice text-gray-400">
                        <Fa icon={iconlist[p.icon]} class="pr-1" /> {p.label}
                     </h3>

                     <div class="flex flex-wrap">
                        {#each subs(p.id) as c}
                           <div class="w-full md:w-1/2 p-2">
                              <div class="w-full p-4 border border-gray-300 rounded-lg">
                                 <h3 class="flex justify-between items-center font-semibold pb-4 text-gray-700">
                                    <span class="flex items-center">
                                       <Fa icon={iconlist[c.icon]} class="pr-1" /> {c.label}
                                    </span>
                                    <span on:click={() => handleGroup(c.key)}>
                                       <Switch bind:checked={privileges[firstId(c.key)]} />
                                    </span>
                                 </h3>
                              <div>
                                 {#each groups(c.key) as x}                                       
                                    <div class="py-1 flex items-center text-gray-600 border-t border-gray-100">                                       
                                       <Switch
                                          bind:checked={privileges[x.id]}
                                          label={x.action}
                                       />
                                    </div>
                                 {/each}
                                 </div>
                              </div>
                           </div>
                        {/each}
                     </div>
                  </div>
               {/each}
            </div>      
            <div class="sticky bottom-0 bg-white flex justify-between items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">
               <Switch bind:checked={form.active} label="aktifkan pengguna ini" />
               <Button
                  loading={loading}
                  on:click={action === "edit" ? update : insert}
                  disabled={
                     !form.name ||
                     form.name === "" ||
                     !form.password ||
                     form.password === "" ||                
							!form.email ||
                     form.email === "" ||
							!form.phone ||
                     form.phone === "" ||
                     !form.fullname ||
                     form.fullname === ""
                  }
               >
                  {action === "edit" ? "Ubah" : "Buat"}
               </Button>
            </div>
         </form>
      </div>
   </div>   
</div>
{:else}
   <PageUnauthorized />
{/if}

