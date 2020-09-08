<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"
   import moment from "moment"
   import Big from "big.js"

	import { appname, menu } from "../../stores"
   import { init, getDataById, getDataArrayById, ppo, ppodet, po, suppliers, items } from "../../stores/data"

   import diff from "../../helpers/diff"
   import fetch from "../../helpers/fetch"
   import thousand from "../../helpers/thousand"

   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
	import { toast } from "../../components/toast"
	import Button from "../../components/buttons/Button.svelte"
	import Field from "../../components/inputs/Field.svelte"
	import FieldNumber from "../../components/inputs/FieldNumber.svelte"
	import Textarea from "../../components/inputs/Textarea.svelte"
	import Select from "../../components/inputs/Select.svelte"
	import Switch from "../../components/inputs/Switch.svelte"

   
   export let data

   const today = moment().format("YYYY-MM-DD")
   const id = data === "new" ? null : data
   const action = data === "new" ? "add" : "edit"
	const initialState = {
      id: "",
      ppoId: "",
      supplierId: "",
      date: today,
      ref: "",
      address: "",
		description: "",
   }
   const initialStateDet = {
      itemId: "",
      dateRequired: today,
      qty: 1,
      ratio: 1,
      unit: "",
      price: 0,
      description: "",
   }
   const heads = [
      { key: "dateRequired", label: "tgl. dibutuhkan", render: x => moment(x.dateRequired).format("DD MMM YYYY")},
      { key: "itemId", label: "produk", render: x => {
         const o = $items.find(y => y.id === x.itemId)
         if (o) return `${o.barcodeGlobal ? '<i>('+o.barcodeGlobal+')</i> ' : ''}<b>${o.barcode}</b> - ${o.name}`
         return "-"
      }},
      { key: "qty", label: "jumlah", render: x => {
         if (x.ratio === 1) {
            return `${x.qty} ${x.unit}`
         }
         const o = $items.find(y => y.id === x.itemId)
         return `${x.qty} ${x.unit} ${x.ratio > 1 ? '(± '+x.qty*x.ratio+' '+o.unit1+')' : '' }`
      } },
      { key: "price", label: "harga", render: x => thousand(x.price)},
      { key: "total", label: "total", render: x => x.qty === "" || x.price === "" ? 0 : thousand(new Big(x.price).times(x.qty).toPrecision())},
   ]
   
	let form = {...initialState}
   let formdet = {...initialStateDet}
   let editState = {}
   let usingPpo = false
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

   const editDetail = (i) => {editState = {...editState, [i]: true}}

   const updateDetail = (i) => {editState = {...editState, [i]: false}}

   const removeDetail = i => {
      detail = detail.filter((_, xi) => xi !== i)
   } 

   const addDetailFromRef = () => {
      const detailPpo = $ppodet.filter(x => x.ppoId === form.ppoId)
      detail = [...detail, ...detailPpo.map(x => ({...x, price: 0, total: 0}))]
   }

   const insert = () => {
      loading = true
      const log = JSON.stringify({...form, detail })      
      fetch.post(`/po`, { ...form, detail, log }).then(res => {
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
      const oldData = $po.find(x => x.id === form.id)
      const log = JSON.stringify(diff({...form, detail}, oldData))
      fetch.put(`/po`, { ...form, detail, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/po")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

   $: if (!usingPpo) {
      form.ppoId = ""
      form.detail = []
   }

   $: if (detail) {
      itemsFiltered = $items.filter(x => detail.findIndex(y => y.itemId === x.id) === -1)
   }

	onMount(() => {
      init("suppliers")
      init("items")
      init("ppo")
      init("ppodet")
      init("po")
      init("podet").then(() => {
         if (action === "edit") {
            const data = getDataById("po", id)
            const datadet = getDataArrayById("podet", id, "poId", true)
            if (data.ppoId) {
               usingPpo = true
            }
            form = { ...form, ...{...data, date: moment(data.date).format("YYYY-MM-DD")} }
            if (datadet.length > 0) {
               detail = datadet.map(x => ({ ...x, dateRequired: moment(x.dateRequired).format("YYYY-MM-DD")})).sort((x, y) => x.id - y.id)
            }
         }
      })
   })
</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Order Pembelian | {$appname}</title>
</svelte:head>

{#if $menu && allow("po", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Order Pembelian</h3>
      <Button 
         circle
         iconOnly
         icon="reply"
         color="red"
         textColor="white"
         on:click={() => $goto("/po")} 
         disabled={$menu && !allow("po", "view")} 
      />
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
            <div class="flex flex-col md:flex-row"> 
               <div class="control md:w-2/3">
                  <Select bind:value={form.supplierId} items={$suppliers} itemId="id" itemLabel={x => `${x.code} - ${x.name}`} searchable />
                  <label>pemasok *</label>
               </div> 
            </div> 
            <div class="control">
               <Textarea bind:value={form.address} />
               <label>alamat pengiriman *</label>
            </div>
            <div class="control md:w-1/3">
               <Switch bind:checked={usingPpo} label="referensi pre order pembelian" disabled={detail.length > 0 || id} />
            </div>
            {#if usingPpo}
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/2">
                  <Select bind:value={form.ppoId} items={$ppo} itemId="id" itemLabel={x => `${moment(x.date).format("DD MMM YYYY")} - ${x.no} (${x.ref})`} searchable disabled={detail.length > 0 || id} />
                  <label>pre order pembelian</label>
               </div> 
               <div class="flex justify-center items-end pb-2">
                  <Button 
                     color="green"
                     textColor="white"
                     disabled={detail.length > 0 || id || !form.ppoId || form.ppoId === ""}
                     on:click={addDetailFromRef}
                  >
                     tambah
                  </Button>   
               </div>
            </div> 
            {/if}
            <div class="control">
               <Textarea bind:value={form.description} />
               <label>deskripsi</label>
            </div>
            <h4 class="mt-10 text-theme-500 text-md font-bold border-b border-theme">Detail</h4>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-4/6">
                  <Select bind:value={formdet.itemId} items={itemsFiltered} itemId="id" itemLabel={x => `${x.barcodeGlobal ? '('+x.barcodeGlobal+') ':''}${x.barcode} - ${x.name}`} on:change={itemIdChanged} searchable />
                  <label>produk *</label>
               </div> 
               <div class="control md:w-2/6">
                  <Field type="date" bind:value={formdet.dateRequired} />
                  <label>tgl. dibutuhkan *</label>
               </div>                
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-2/6">
                  <FieldNumber bind:value={formdet.qty} />
                  <label>jumlah *</label>
               </div> 
               <div class="control md:w-2/6">
                  <Select bind:value={formdet.unit} items={units} on:change={unitChanged} itemId="unit" itemLabel="unit" />
                  <label>satuan *</label>
               </div>
               <div class="control md:w-2/6">
                  <FieldNumber bind:value={formdet.price} />
                  <label>harga *</label>
               </div> 
            </div>
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-4/6">
                  <Textarea bind:value={formdet.description} />
                  <label>deskripsi lainnya</label>
               </div>
               <div class="flex justify-center items-end pb-2 md:w-2/6">
                  <Button 
                     color="yellow"
                     textColor="white"
                     disabled={
                        !formdet.itemId || formdet.itemId === "" ||
                        !formdet.dateRequired || formdet.dateRequired === "" ||
                        !formdet.qty || formdet.qty === "" ||
                        !formdet.unit || formdet.unit === "" ||
                        !formdet.price || formdet.price === ""
                     }
                     on:click={addDetail}
                  >
                     tambah
                  </Button>             
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
                              {#if editState[i] === true && (head.key === "qty" || head.key === "price")}
                                 <div class="flex items-center">
                                    <Field bind:value={data[head.key]} />{#if head.key === "qty"} <span class="pl-2">{data.unit}</span>{/if} 
                                 </div>
                              {:else}
                                 {@html head.render ? head.render(data) : data[head.key]}
                              {/if}
                           </td>
                        {/each}
                        <td class="flex justify-between min-w-0 md:min-w-0 px-4 py-2 border-l border-r border-t border-gray-200">
                           {#if editState[i] === true}
                              <Button
                                 circle
                                 iconOnly
                                 icon="save"
                                 color="green"
                                 textColor="white"
                                 on:click={() => updateDetail(i)}
                              />
                           {:else}
                              <Button
                                 circle
                                 iconOnly
                                 icon="pencil-alt"
                                 color="yellow"
                                 textColor="white"
                                 on:click={() => editDetail(i)}
                              />
                              <Button
                                 circle
                                 iconOnly
                                 icon="trash-alt"
                                 color="red"
                                 textColor="white"
                                 on:click={() => removeDetail(i)}
                              />                        
                           {/if}
                        </td>
                     </tr>
                  {/each}
                  {:else}
                     <tr>
                        <td colspan={heads.length + 2} class="text-center px-4 py-2 border-l border-r border-t border-gray-200">Tidak ada data.</td>
                     </tr>
                  {/if}
               </tbody>
            </table>
            <div class="sticky bottom-0 bg-white flex justify-end items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">               
               <Button
                  color="theme"
                  textColor="white"
                  loading={loading}
                  on:click={action === "edit" ? update : insert}
                  disabled={
                     !form.date || form.date === "" ||
                     !form.supplierId || form.supplierId === "" ||
                     !form.address || form.address === "" ||
                     !detail.length || detail.length === 0
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

