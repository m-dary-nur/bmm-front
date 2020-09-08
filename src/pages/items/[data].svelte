<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

	import { appname, menu } from "../../stores"
   import { init, getDataById, items, itemgroups, suppliers } from "../../stores/data"

   import diff from "../../helpers/diff"
   import fetch from "../../helpers/fetch"
   import thousand from "../../helpers/thousand"

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
      itemGroupId: "",
      supplierId: "",
      code: "",
      barcode: "",
      barcodeGlobal: "",
      name: "",
		alias: "",
		unit1: "",
		ratio1: 1,
		unit2: "",
		ratio2: "",
		unit3: "",
		ratio3: "",
		unitOther: "",
		model: "",
		color: "",
		weight: "",
		description: "",
		active: true,
   }
   
	let form = {...initialState}
   let loading = false

   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1

   const insert = () => {
      loading = true
      const log = JSON.stringify(form)      
      fetch.post(`/items`, { ...form, log }).then(res => {
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
      const oldData = $items.find(x => x.id === form.id)
      const log = JSON.stringify(diff(form, oldData))
      fetch.put(`/items`, { ...form, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/items")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

	onMount(() => {
      init("itemgroups")
      init("suppliers")
      init("items").then(() => {
         if (action === "edit") {
            const data = getDataById("items", id)
            form = { ...form, ...data }
         }
      })
   })

   $: if (!form.unit1) {
      form.unit2 = ""
      form.ratio2 = ""
      form.unit3 = ""
      form.ratio3 = ""
   }

   $: if (!form.unit2) {
      form.ratio2 = ""
      form.unit3 = ""
      form.ratio3 = ""
   }

   $: if (!form.unit3) {
      form.ratio3 = ""
   }

</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Produk | {$appname}</title>
</svelte:head>

{#if $menu && allow("items", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Produk</h3>
      <Button 
         circle
         iconOnly
         icon="reply"
         color="red"
         textColor="white"
         on:click={() => $goto("/items")} 
         disabled={$menu && !allow("items", "view")} 
      />
   </div> 
   <div class="w-full md:pt-2 md:px-6 scrolling-auto">
      <div class="w-full md:w-10/12 xl:w-8/12 md:pr-4 md:border-r border-gray-300">
         <form class="w-full">
            <div class="flex flex-col md:flex-row">               
               <div class="control md:w-1/3">
                  <Select bind:value={form.itemGroupId} items={$itemgroups} itemId="id" itemLabel="name" />
                  <label>grup produk *</label>
               </div>
               <div class="control md:w-1/3">
                  <Field bind:value={form.code} />
                  <label>kode produk *</label>
               </div>
               <div class="control md:w-1/3">
                  <Field bind:value={form.barcode} />
                  <label>barcode produk</label>
               </div>   
            </div>
            <div class="flex flex-col md:flex-row">               
               <div class="control md:w-1/3">
                  <Field bind:value={form.barcodeGlobal} />
                  <label>barcode nasional</label>
               </div>
               <div class="control md:w-1/3">
                  <Field bind:value={form.barcode} />
                  <label>barcode produk</label>
               </div>   
            </div>  
            <div class="control md:w-2/3">
               <Select bind:value={form.supplierId} items={$suppliers} itemId="id" itemLabel={x => `${x.code} - ${x.name}`} searchable />
               <label>Pemasok</label>
            </div>
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/2">
                  <Field bind:value={form.name} />
                  <label>nama produk *</label>
               </div>               
               <div class="control md:w-1/2">
                  <Field bind:value={form.alias} />
                  <label>alias</label>
               </div>
            </div>    
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/2">
                  <Field bind:value={form.unit1} />
                  <label>satuan 1 *</label>
               </div>             
            </div>  
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/2">
                  <Field bind:value={form.unit2} disabled={!form.unit1} />
                  <label>satuan 2</label>
               </div>
               <div class="control md:w-1/2">
                  <Field bind:value={form.ratio2} disabled={!form.unit2} />
                  <label>rasio {form.unit2 ? `${form.unit2} (1 ${form.unit2} = ${form.ratio2 ? thousand(form.ratio2) : 0} ${form.unit1}) *` : '2'}</label>
               </div>               
            </div>  
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/2">
                  <Field bind:value={form.unit3} disabled={!form.ratio2} />
                  <label>satuan 3</label>
               </div>
               <div class="control md:w-1/2">
                  <Field bind:value={form.ratio3} disabled={!form.unit3} />
                  <label>rasio {form.unit3 ? `${form.unit3} (1 ${form.unit3} = ${form.ratio3 ? thousand(form.ratio3) : 0} ${form.unit1}) *` : '3'}</label>
               </div>               
            </div>     
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/2">
                  <Field bind:value={form.unitOther} />
                  <label>satuan lainnya</label>
               </div>
               <div class="control md:w-1/2">
                  <Field bind:value={form.model} />
                  <label>model</label>
               </div>               
            </div>   
            <div class="flex flex-col md:flex-row">					
               <div class="control md:w-1/2">
                  <Field bind:value={form.color} />
                  <label>warna</label>
               </div>
               <div class="control md:w-1/2">
                  <Field bind:value={form.weight} />
                  <label>berat</label>
               </div>               
            </div>          
            <div class="control">
               <Textarea bind:value={form.description} />
               <label>deskripsi</label>
            </div>
            <div class="sticky bottom-0 bg-white flex justify-between items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">
               <Switch bind:checked={form.active} label="aktifkan produk ini" />
               <Button
                  color="theme"
                  textColor="white"
                  loading={loading}
                  on:click={action === "edit" ? update : insert}
                  disabled={
                     !form.itemGroupId ||
                     form.itemGroupId === "" ||
                     !form.code ||
                     form.code === "" ||
                     !form.name ||
                     form.name === "" ||
                     !form.unit1 ||
                     form.unit1 === "" ||
                     (form.unit2 !== "" && (!form.ratio2 || form.ratio2 === "") ? true : false) ||
                     (form.unit3 !== "" && (!form.ratio3 || form.ratio3 === "") ? true : false)
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

