<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"
   import moment from "moment"

	import { appname, menu, branch } from "../../stores"
   import { init, getDataById, ppo, items } from "../../stores/data"

   import diff from "../../helpers/diff"
   import fetch from "../../helpers/fetch"

   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
	import { toast } from "../../components/toast"
	import ButtonBack from "../../components/buttons/Back.svelte"
	import ButtonWarning from "../../components/buttons/Warning.svelte"
	import Button from "../../components/buttons/Primary.svelte"
	import Field from "../../components/inputs/Field.svelte"
	import Number from "../../components/inputs/Number.svelte"
	import Textarea from "../../components/inputs/Textarea.svelte"
	import Select from "../../components/inputs/Select.svelte"
	import Switch from "../../components/inputs/Switch.svelte"

   
   export let data

   const today = moment().format("YYYY-MM-DD")
   const id = data === "new" ? null : data
   const action = data === "new" ? "add" : "edit"
	const initialState = {
      id: "",
      date: today,
      ref: "",
		description: "",
		active: true,
   }
   const initialStateDet = {
      itemId: "",
      dateRequired: today,
      qty: 1,
      unit: "",
      description: "",
   }
   const heads = [
      { key: "itemId", label: "produk", render: x => {
         const o = $items.find(y => y.id === x.itemId)
         if (o) return `${o.barcode} - ${o.name} (${o.barcodeSupplier})`
         return "-"
      }},
      { key: "unit", label: "jumlah", render: x => `${x.qty} ${x.unit}` },
   ]
   
	let form = {...initialState}
   let formdet = {...initialStateDet}
   let detail = []
   let loading = false
   let units = []
   
   
   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1
   
   const itemIdChanged = () => {
      const item = $items.find(x => x.id === formdet.itemId)
      units = []
      if (item) {
         let newUnits = []
         for (let i = 1; i < 6; i++) {
            if (item[`unit${i}`] === undefined || item[`unit${i}`] === "" || item[`unit${i}`] === null) {
               break
            }
            newUnits = [...newUnits, {unit: item[`unit${i}`]}]
         }
         units = newUnits
         formdet.unit = units[0].unit
      }
   }

   const addDetail = () => {
      const i = detail.findIndex(x => x.itemId === formdet.itemId)      
      if (i === -1) {
         detail = [...detail, {...formdet}]
         formdet = {...initialStateDet}
      }
   }

   const insert = () => {
      loading = true
      const log = JSON.stringify(form)      
      fetch.post(`/ppo`, { ...form, log }).then(res => {
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
      const oldData = $ppo.find(x => x.id === form.id)
      const log = JSON.stringify(diff(form, oldData))
      fetch.put(`/ppo`, { ...form, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/ppo")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

	onMount(() => {
      init("items")
      init("ppo").then(() => {
         if (action === "edit") {
            const data = getDataById("ppo", id)
            form = { ...form, ...data }
         } else {
            form = { ...form, id: $branch.id }
         }
      })
   })
</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Pre Order Pembelian | {$appname}</title>
</svelte:head>

{#if $menu && allow("ppo", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Pre Order Pembelian</h3>
      <ButtonBack on:click={() => $goto("/ppo")} disabled={$menu && !allow("ppo", "view")} />
   </div> 
   <div class="w-full md:pt-2 md:px-6 scrolling-auto">
      <div class="w-full md:w-12/12 xl:w-10/12 md:pr-4 md:border-r border-gray-300">
         <form class="w-full">
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-2/6">
                  <Field type="date" bind:value={form.date} />
                  <label>tanggal *</label>
               </div> 
               <div class="control md:w-4/6">
                  <Field bind:value={form.ref} />
                  <label>referensi</label>
               </div>                
            </div>
            <div class="control">
               <Textarea bind:value={form.description} />
               <label>deskripsi</label>
            </div>
            <h4 class="mt-6 text-gray-500 text-md font-bold">Detail</h4>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-4/6">
                  <Select bind:value={formdet.itemId} items={$items} itemId="id" itemLabel={x => `${x.barcode} - ${x.name} (${x.barcodeSupplier})`} on:change={itemIdChanged} searchable />
                  <label>produk *</label>
               </div> 
               <div class="control md:w-2/6">
                  <Field type="date" bind:value={formdet.dateRequired} />
                  <label>tgl dibutuhkan *</label>
               </div>                
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-2/6">
                  <Field bind:value={formdet.qty} />
                  <label>jumlah *</label>
               </div> 
               <div class="control md:w-2/6">
                  <Select bind:value={formdet.unit} items={units} itemId="unit" itemLabel="unit" />
                  <label>satuan *</label>
               </div>
               <div class="flex justify-center items-end pb-2 md:w-2/6">
                  <ButtonWarning 
                     on:click={addDetail}
                  >
                     tambah
                  </ButtonWarning>             
               </div>
            </div>
            <table class="w-full mt-4">
               <thead>
                  <tr>
                     <th class="bg-white sticky top-0 px-4 py-3 text-gray-500 font-semibold text-left shadow-th whitespace-no-wrap">#</th>
                     {#each heads as head (head.key)}
                        <th class="bg-white sticky top-0 px-4 py-3 text-gray-500 font-semibold text-left shadow-th whitespace-no-wrap">
                           {head.label}
                        </th>
                     {/each}
                     <th class="bg-white sticky top-0 px-4 py-3 text-gray-500 font-semibold text-left shadow-th whitespace-no-wrap"></th>
                  </tr>
               </thead>
               <tbody>
                  {#if detail.length > 0}
                  {#each detail as data, i (data.itemId)}
                     <tr>
                        <td class="px-4 py-2 border-l border-r border-t border-gray-200 min-w-42 md:min-w-0">{i+1}</td>
                        {#each heads as head (head.key)}
                           <td class="px-4 py-2 border-l border-r border-t border-gray-200 min-w-42 md:min-w-0">
                              {@html head.render ? head.render(data) : data[head.key]
                           }</td>
                        {/each}
                     </tr>
                  {/each}
                  {:else}
                     <tr>
                        <td colspan="3" class="text-center px-4 py-2 border-l border-r border-t border-gray-200 min-w-42 md:min-w-0">Tidak ada data.</td>
                     </tr>
                  {/if}
               </tbody>
            </table>
            <div class="sticky bottom-0 bg-white flex justify-end items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">               
               <Button
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

