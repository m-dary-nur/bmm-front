<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

	import { appname, menu } from "../../stores"
   import { init, getDataById, suppliers } from "../../stores/data"

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
      code: "",
      name: "",
		email: "",
		phone: "",
		address: "",
		bankName: "",
		bankNo: "",
		active: true,
   }
   
	let form = {...initialState}
   let loading = false

   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1

   const insert = () => {
      loading = true
      const log = JSON.stringify(form)      
      fetch.post(`/suppliers`, { ...form, log }).then(res => {
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
      const oldData = $suppliers.find(x => x.id === form.id)
      const log = JSON.stringify(diff(form, oldData))
      fetch.put(`/suppliers`, { ...form, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/suppliers")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

	onMount(() => {
      init("suppliers").then(() => {
         if (action === "edit") {
            const data = getDataById("suppliers", id)
            form = { ...form, ...data }
         }
      })
   })
</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Pemasok | {$appname}</title>
</svelte:head>

{#if $menu && allow("suppliers", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Pemasok</h3>
      <Button 
         circle
         iconOnly
         icon="reply"
         color="red"
         textColor="white"
         on:click={() => $goto("/suppliers")} 
         disabled={$menu && !allow("suppliers", "view")} 
      />
   </div> 
   <div class="w-full md:pt-2 md:px-6 scrolling-auto">
      <div class="w-full md:w-10/12 xl:w-8/12 md:pr-4 md:border-r border-gray-300">
         <form class="w-full">
            <div class="p-4">
               <h5 class="text-red-500 leading-relaxed">* kode pemasok tidak dapat diubah setelah dibuat.</h5>
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/3">
                  <Field bind:value={form.code} disabled={id} />
                  <label>kode pemasok *</label>
               </div>
               <div class="control md:w-2/3">
                  <Field bind:value={form.name} />
                  <label>nama pemasok *</label>
               </div>
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/2">
                  <Field bind:value={form.email} />
                  <label>email</label>
               </div> 
               <div class="control md:w-1/2">
                  <Field bind:value={form.phone} />
                  <label>nomor telepon</label>
               </div>                
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/2">
                  <Field bind:value={form.bankName} />
                  <label>nama bank</label>
               </div> 
               <div class="control md:w-1/2">
                  <Field bind:value={form.bankNo} />
                  <label>nomor rekening bank</label>
               </div>                
            </div>
            <div class="control">
               <Textarea bind:value={form.address} />
               <label>alamat *</label>
            </div>
            <div class="sticky bottom-0 bg-white flex justify-between items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">
               <Switch bind:checked={form.active} label="aktifkan pemasok ini" />
               <Button
                  color="theme"
                  textColor="white"
                  loading={loading}
                  on:click={action === "edit" ? update : insert}
                  disabled={
                     !form.name ||
                     form.name === "" ||
                     !form.address ||
                     form.address === ""
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

