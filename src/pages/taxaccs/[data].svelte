<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

	import { appname, menu } from "../../stores"
   import { init, getDataById, taxaccs, taxtypes } from "../../stores/data"

   import diff from "../../helpers/diff"
   import fetch from "../../helpers/fetch"

   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
	import { toast } from "../../components/toast"
	import ButtonBack from "../../components/buttons/Back.svelte"
	import Button from "../../components/buttons/Primary.svelte"
	import Field from "../../components/inputs/Field.svelte"
	import Textarea from "../../components/inputs/Textarea.svelte"
	import Select from "../../components/inputs/Select.svelte"
	import Switch from "../../components/inputs/Switch.svelte"

   
   export let data

   const id = data === "new" ? null : data
   const action = data === "new" ? "add" : "edit"
	const initialState = {
      isBankAcc: false,
      no: "",
      name: "",
		taxTypeId: "",
		taxAccParentId: "",
		bankName: "",
		bankNo: "",
		bankAn: "",
		bankAddress: "",
		active: true,
   }
   
	let form = initialState
   let loading = false

   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1

   const insert = () => {
      loading = true
      const log = JSON.stringify(form)      
      fetch.post(`/taxaccs`, { ...form, log }).then(res => {
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
      const oldData = $taxaccs.find(x => x.id === form.id)
      const log = JSON.stringify(diff(form, oldData))
      fetch.put(`/taxaccs`, { ...form, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/taxaccs")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

	onMount(() => {
      init("taxtypes")
      init("taxaccs").then(() => {
         if (action === "edit") {
            const data = getDataById("taxaccs", id)
            form = { ...form, ...data }
         }
      })
   })

</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Akun Pajak | {$appname}</title>
</svelte:head>

{#if $menu && allow("taxaccs", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Akun Pajak</h3>
      <ButtonBack on:click={() => $goto("/taxaccs")} disabled={$menu && !allow("taxaccs", "view")} />
   </div> 
   <div class="w-full md:pt-2 md:px-6 scrolling-auto">
      <div class="w-full md:w-10/12 xl:w-8/12 md:pr-4 md:border-r border-gray-300">
         <form class="w-full">
            <div class="control">
               <Switch bind:checked={form.isBankAcc} label="akun buku bank" />
            </div>
            <div class="flex flex-col md:flex-row">               
               <div class="control md:w-2/6">
                  <Field bind:value={form.no} />
                  <label>nomor akun *</label>
               </div>
               <div class="control md:w-4/6">
                  <Field bind:value={form.name} />
                  <label>nama akun *</label>
               </div>
            </div>
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/2">
                  <Select bind:value={form.taxTypeId} items={$taxtypes} itemId="id" itemLabel="name" />
                  <label>tipe akun *</label>
               </div>
               <div class="control md:w-1/2">
                  <Field bind:value={form.taxAccParentId} />
                  <label>akun induk</label>
               </div>               
            </div>    
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/3">
                  <Field bind:value={form.bankName} />
                  <label>nama bank</label>
               </div>
               <div class="control md:w-1/3">
                  <Field bind:value={form.bankNo} />
                  <label>nomor rekening</label>
               </div>
               <div class="control md:w-1/3">
                  <Field bind:value={form.bankAn} />
                  <label>atas nama</label>
               </div>               
            </div>             
            <div class="control">
               <Textarea bind:value={form.bankAddress} />
               <label>alamat akun bank</label>
            </div>
            <div class="sticky bottom-0 bg-white flex justify-between items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">
               <Switch bind:checked={form.active} label="aktifkan akun ini" />
               <Button
                  loading={loading}
                  on:click={action === "edit" ? update : insert}
                  disabled={
                     !form.no ||
                     form.no === "" ||
                     !form.name ||
                     form.name === "" ||
							!form.taxTypeId ||
                     form.taxTypeId === ""
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

