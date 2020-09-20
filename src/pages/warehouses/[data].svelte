<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

	import { appname, menu, branch } from "../../stores"
   import { init, getDataById, warehouses, branches } from "../../stores/data"

   import diff from "../../helpers/diff"
   import fetch from "../../helpers/fetch"

   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
	import { toast } from "../../components/toast"
	import Button from "../../components/buttons/Button.svelte"
	import Field from "../../components/inputs/Field.svelte"
	import Textarea from "../../components/inputs/Textarea.svelte"
	import Select from "../../components/inputs/Select.svelte"
	import Switch from "../../components/inputs/Switch.svelte"

   
   export let data

   const id = data === "new" ? null : data
   const action = data === "new" ? "add" : "edit"
	const initialState = {
      id: "",
      branchId: "",
      name: "",
      phone: "",
		address: "",
		active: true,
   }
   
	let form = {...initialState}
   let loading = false

   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1

   const insert = () => {
      loading = true
      const log = JSON.stringify(form)      
      fetch.post(`/warehouses`, { ...form, log }).then(res => {
         loading = false
         if (res.success) {
            form = {...initialState}
            toast.success("Berhasil dibuat",res.message)
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

   const update = () => {
      loading = true
      const oldData = $warehouses.find(x => x.id === form.id)
      const log = JSON.stringify(diff(form, oldData))
      fetch.put(`/warehouses`, { ...form, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/warehouses")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

	onMount(() => {
      init("branches")
      init("warehouses").then(() => {
         if (action === "edit") {
            const data = getDataById("warehouses", id)
            form = { ...form, ...data }
         } else {
            form = { ...form, id: $branch.id }
         }
      })
   })
</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Gudang | {$appname}</title>
</svelte:head>

{#if $menu && allow("warehouses", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Gudang</h3>
      <Button 
         circle
         iconOnly
         icon="reply"
         color="red"
         textColor="white"
         on:click={() => $goto("/warehouses")} 
         disabled={$menu && !allow("warehouses", "view")} 
      />
   </div> 
   <div class="w-full md:pt-2 md:px-6 scrolling-auto">
      <div class="w-full md:w-10/12 xl:w-8/12 md:pr-4 md:border-r border-gray-300">
         <form class="w-full">
            <div class="control md:w-1/2">
               <Select bind:value={form.branchId} items={$branches} itemId="id" itemLabel="name" />
               <label>cabang *</label>
            </div> 
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/2">
                  <Field bind:value={form.name} />
                  <label>nama gudang *</label>
               </div> 
               <div class="control md:w-1/2">
                  <Field bind:value={form.phone} />
                  <label>no. telepon gudang</label>
               </div>                
            </div>
            <div class="control">
               <Textarea bind:value={form.address} />
               <label>alamat</label>
            </div>
            <div class="sticky bottom-0 bg-white flex justify-between items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">
               <Switch bind:checked={form.active} label="aktifkan gudang ini" />
               <Button
                  color="theme"
                  textColor="white"
                  loading={loading}
                  on:click={action === "edit" ? update : insert}
                  disabled={
                     !form.branchId ||
                     form.branchId === "" ||
                     !form.name ||
                     form.name === ""
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

