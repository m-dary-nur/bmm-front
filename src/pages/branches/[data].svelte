<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

	import { appname, menu } from "../../stores"
   import { init, getDataById, branches } from "../../stores/data"

   import diff from "../../helpers/diff"
   import fetch from "../../helpers/fetch"

   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
	import { toast } from "../../components/toast"
	import ButtonBack from "../../components/buttons/Back.svelte"
	import Button from "../../components/buttons/Primary.svelte"
	import Field from "../../components/inputs/Field.svelte"
	import Textarea from "../../components/inputs/Textarea.svelte"
	import Switch from "../../components/inputs/Switch.svelte"

   
   export let data

   const id = data === "new" ? null : data
   const action = data === "new" ? "add" : "edit"
	const initialState = {
      isCenter: false,
      code: "",
      name: "",
		email: "",
		phone: "",
		email: "",
		phone: "",
		address: "",
		captionPurchase: "",
		captionSale: "",
		active: true,
   }
   
	let form = initialState
   let loading = false

   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1

   const insert = () => {
      loading = true
      const log = JSON.stringify(form)      
      fetch.post(`/branches`, { ...form, log }).then(res => {
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
      const oldData = $branches.find(x => x.id === form.id)
      const log = JSON.stringify(diff(form, oldData))
      fetch.put(`/branches`, { ...form, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/branches")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

	onMount(() => {
      init("branches").then(() => {
         if (action === "edit") {
            const data = getDataById("branches", id)
            form = { ...form, ...data }
         }
      })
   })
</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Pengguna | {$appname}</title>
</svelte:head>

{#if $menu && allow("branches", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Pengguna</h3>
      <ButtonBack on:click={() => $goto("/branches")} disabled={$menu && !allow("branches", "view")} />
   </div> 
   <div class="w-full md:pt-2 md:px-6 scrolling-auto">
      <div class="w-full md:w-10/12 xl:w-8/12 md:pr-4 md:border-r border-gray-300">
         <form class="w-full">
            <div class="p-4">
               <h5 class="text-red-500 leading-relaxed">* kode transaksi tidak dapat diubah setelah dibuat.</h5>
            </div>
            <div class="control">
               <Switch bind:checked={form.isCenter} label="jadikan cabang pusat" />
            </div>
            <div class="flex flex-col md:flex-row">               
               <div class="control md:w-2/6">
                  <Field bind:value={form.code} disabled={id} />
                  <label>kode transaksi *</label>
               </div>
               <div class="control md:w-4/6">
                  <Field bind:value={form.name} />
                  <label>nama cabang *</label>
               </div>
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
            <div class="control">
               <Textarea bind:value={form.address} />
               <label>alamat *</label>
            </div>
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/2">
                  <Textarea bind:value={form.captionPurchase} />
                  <label>footer pembelian</label>
               </div>
               <div class="control md:w-1/2">
                  <Textarea bind:value={form.captionSale} />
                  <label>footer penjualan</label>
               </div>               
            </div> 
            <div class="sticky bottom-0 bg-white flex justify-between items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">
               <Switch bind:checked={form.active} label="aktifkan cabang ini" />
               <Button
                  loading={loading}
                  on:click={action === "edit" ? update : insert}
                  disabled={
                     !form.code ||
                     form.code === "" ||
                     !form.name ||
                     form.name === "" ||
							!form.email ||
                     form.email === "" ||
							!form.phone ||
                     form.phone === "" ||
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

