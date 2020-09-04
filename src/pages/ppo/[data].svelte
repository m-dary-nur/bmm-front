<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"
   import moment from "moment"
   import Fa from "svelte-fa"
   import { faTrash } from "@fortawesome/pro-regular-svg-icons"

	import { appname, menu, branch } from "../../stores"
   import { init, getDataById, getDataArrayById, ppo, items } from "../../stores/data"

   import diff from "../../helpers/diff"
   import fetch from "../../helpers/fetch"

   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
	import { toast } from "../../components/toast"
	import ButtonBack from "../../components/buttons/Back.svelte"
	import ButtonWarning from "../../components/buttons/Warning.svelte"
	import ButtonDanger from "../../components/buttons/Danger.svelte"
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
   }
   const initialStateDet = {
      itemId: "",
      dateRequired: today,
      qty: 1,
      ratio: 1,
      unit: "",
      description: "",
   }
   const heads = [
      { key: "dateRequired", label: "tgl dibutuhkan", render: x => moment(x.dateRequired).format("DD MMM YYYY")},
      { key: "itemId", label: "produk", render: x => {
         const o = $items.find(y => y.id === x.itemId)
         if (o) return `${o.barcodeSupplier ? '<i>('+o.barcodeSupplier+')</i> ' : ''}<b>${o.barcode}</b> - ${o.name}`
         return "-"
      }},
      { key: "unit", label: "jumlah", render: x => {
         if (x.ratio === 1) {
            return `${x.qty} ${x.unit}`
         }
         const o = $items.find(y => y.id === x.itemId)
         return `${x.qty} ${x.unit} ${x.ratio > 1 ? '(± '+x.qty*x.ratio+' '+o.unit1+')' : '' }`
      } },
   ]
   
	let form = {...initialState}
   let formdet = {...initialStateDet}
   let detail = []
   let loading = false
   let units = []
   let itemsFiltered = $items
   
   
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
            newUnits = [...newUnits, {unit: item[`unit${i}`], ratio: item[`ratio${i}`]}]
         }
         units = newUnits
         const { unit, ratio } = units[0]
         formdet.unit = unit
         formdet.ratio = ratio
      }
   }

   const unitChanged = () => {
      const o = units.find(x => x.unit === formdet.unit)
      formdet.ratio = o.ratio
   }

   const addDetail = () => {
      const i = detail.findIndex(x => x.itemId === formdet.itemId)      
      if (i === -1) {
         detail = [...detail, {...formdet}]
         formdet = {...initialStateDet}
      }
   }

   const removeDetail = i => {
      detail = detail.filter((x, xi) => xi !== i)
   } 

   const insert = () => {
      loading = true
      const log = JSON.stringify({...form, detail })      
      fetch.post(`/ppo`, { ...form, detail, log }).then(res => {
         loading = false
         if (res.success) {
            form = {...initialState}
            formdet = {...initialStateDet}
            detail = []
            toast.success("Berhasil dibuat",res.message)
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

   const update = () => {
      loading = true
      const oldData = $ppo.find(x => x.id === form.id)
      const log = JSON.stringify(diff({...form, detail}, oldData))
      fetch.put(`/ppo`, { ...form, detail, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/ppo")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

   $: if (detail) {
      itemsFiltered = $items.filter(x => detail.findIndex(y => y.itemId === x.id) === -1)
   }

	onMount(() => {
      init("items")
      init("ppo")
      init("ppodet").then(() => {
         if (action === "edit") {
            const data = getDataById("ppo", id)
            const datadet = getDataArrayById("ppodet", id, "poId", true)
            form = { ...form, ...data }
            if (datadet.length > 0) {
               detail = datadet.map(x => ({ ...x, dateRequired: moment(x.dateRequired).format("YYYY-MM-DD")})).sort((x, y) => x.id - y.id)
            }
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
                  <Select bind:value={formdet.itemId} items={itemsFiltered} itemId="id" itemLabel={x => `${x.barcodeSupplier ? '('+x.barcodeSupplier+') ':''}${x.barcode} - ${x.name}`} on:change={itemIdChanged} searchable />
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
                  <Select bind:value={formdet.unit} items={units} on:change={unitChanged} itemId="unit" itemLabel="unit" />
                  <label>satuan *</label>
               </div>
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-4/6">
                  <Textarea bind:value={formdet.description} />
                  <label>deskripsi produk</label>
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
                        <td class="w-2 px-4 py-2 border-l border-r border-t border-gray-200 min-w-42 md:min-w-0">
                           <ButtonDanger 
                              on:click={() => removeDetail(i)}
                           >
                              <Fa icon={faTrash} class="my-1" />
                           </ButtonDanger>  
                        </td>
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
                     !form.date ||
                     form.date === "" ||
                     !detail.length ||
                     detail.length === 0
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

