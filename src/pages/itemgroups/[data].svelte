<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

	import { appname, menu } from "../../stores"
   import { init, getDataById, itemgroups, itemtypes, taxaccs } from "../../stores/data"

   import diff from "../../helpers/diff"
   import fetch from "../../helpers/fetch"

   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
	import { toast } from "../../components/toast"
	import ButtonBack from "../../components/buttons/Back.svelte"
	import Button from "../../components/buttons/Primary.svelte"
	import Field from "../../components/inputs/Field.svelte"
	import Select from "../../components/inputs/Select.svelte"
	import Switch from "../../components/inputs/Switch.svelte"

   
   export let data

   const id = data === "new" ? null : data
   const action = data === "new" ? "add" : "edit"
	const initialState = {
      id: "",
      name: "",
      itemTypeId: "",
		taxAccSupplyId: "",
		taxAccNonSupplyId: "",
		taxAccSaleId: "",
		taxAccDiscSaleId: "",
		taxAccSentId: "",
		taxAccHppId: "",
		taxAccUncollectedPurchaseId: "",
		active: true,
   }
   
	let form = initialState
   let loading = false

   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1

   const insert = () => {
      loading = true
      const log = JSON.stringify(form)      
      fetch.post(`/itemgroups`, { ...form, log }).then(res => {
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
      const oldData = $itemgroups.find(x => x.id === form.id)
      const log = JSON.stringify(diff(form, oldData))
      fetch.put(`/itemgroups`, { ...form, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/itemgroups")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

	onMount(() => {
      init("itemtypes")
      init("taxaccs")
      init("itemgroups").then(() => {
         if (action === "edit") {
            const data = getDataById("itemgroups", id)
            form = { ...form, ...data }
         }
      })
   })
</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Grup Produk | {$appname}</title>
</svelte:head>

{#if $menu && allow("itemgroups", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Grup Produk</h3>
      <ButtonBack on:click={() => $goto("/itemgroups")} disabled={$menu && !allow("itemgroups", "view")} />
   </div> 
   <div class="w-full md:pt-2 md:px-6 scrolling-auto">
      <div class="w-full md:w-10/12 xl:w-8/12 md:pr-4 md:border-r border-gray-300">
         <form class="w-full">
            <div class="control md:w-2/3">
               <Field bind:value={form.name} />
               <label>nama grup produk *</label>
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/2">
                  <Select bind:value={form.itemTypeId} items={$itemtypes} itemId="id" itemLabel="name" searchable />
                  <label>tipe produk *</label>
               </div>   
               <div class="control md:w-1/2">
                  <Select bind:value={form.taxAccUncollectedPurchaseId} items={$taxaccs} itemId="id" itemLabel="name" searchable />
                  <label>akun pembelian belum tertagih *</label>
               </div>              
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/2">
                  <Select bind:value={form.taxAccSupplyId} items={$taxaccs} itemId="id" itemLabel="name" searchable />
                  <label>akun persediaan *</label>
               </div>   
               <div class="control md:w-1/2">
                  <Select bind:value={form.taxAccNonSupplyId} items={$taxaccs} itemId="id" itemLabel="name" searchable />
                  <label>akun non persediaan *</label>
               </div>                
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/2">
                  <Select bind:value={form.taxAccSaleId} items={$taxaccs} itemId="id" itemLabel="name" searchable />
                  <label>akun penjualan *</label>
               </div> 
               <div class="control md:w-1/2">
                  <Select bind:value={form.taxAccDiscSaleId} items={$taxaccs} itemId="id" itemLabel="name" searchable />
                  <label>akun potongan penjualan *</label>
               </div>                
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/2">
                  <Select bind:value={form.taxAccSentId} items={$taxaccs} itemId="id" itemLabel="name" searchable />
                  <label>akun terkirim *</label>
               </div> 
               <div class="control md:w-1/2">
                  <Select bind:value={form.taxAccHppId} items={$taxaccs} itemId="id" itemLabel="name" searchable />
                  <label>akun HPP *</label>
               </div>                
            </div>
            <div class="sticky bottom-0 bg-white flex justify-between items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">
               <Switch bind:checked={form.active} label="aktifkan grup produk ini" />
               <Button
                  loading={loading}
                  on:click={action === "edit" ? update : insert}
                  disabled={
                     !form.name ||
                     form.name === "" ||
                     !form.itemTypeId ||
                     form.itemTypeId === "" ||
                     !form.taxAccSupplyId ||
                     form.taxAccSupplyId === "" ||
                     !form.taxAccNonSupplyId ||
                     form.taxAccNonSupplyId === "" ||
                     !form.taxAccSaleId ||
                     form.taxAccSaleId === "" ||
                     !form.taxAccDiscSaleId ||
                     form.taxAccDiscSaleId === "" ||
                     !form.taxAccSentId ||
                     form.taxAccSentId === "" ||
                     !form.taxAccHppId ||
                     form.taxAccHppId === "" ||
                     !form.taxAccUncollectedPurchaseId ||
                     form.taxAccUncollectedPurchaseId === ""
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

