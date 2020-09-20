<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"
   import moment from "moment"
   import Big from "big.js"

	import { appname, menu } from "../../stores"
   import { init, getDataById, getDataArrayById, po, podet, warehouses, suppliers, items } from "../../stores/data"

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
import Detail from "./detail/[detail].svelte"
import { faInfo } from "@fortawesome/pro-regular-svg-icons";

   
   export let data

   const today = moment().format("YYYY-MM-DD")
   const id = data === "new" ? null : data
   const action = data === "new" ? "add" : "edit"
	const initialState = {
      id: "",
      poId: "",
      supplierId: "",
      warehouseId: "",
      date: today,
      ref: "",
		description: "",
   }
   const initialStateDet = {
      itemId: "",
      qty: 1,
      ratio: 1,
      unit: "",
      price: 0,
      total: 0,
      description: "",
   }
   const heads = [
      { key: "itemId", label: "produk", render: x => {
         const o = $items.find(y => y.id === x.itemId)
         if (o) return `${o.barcodeGlobal ? '<i>('+o.barcodeGlobal+')</i> ' : ''}<b>${o.barcode}</b> - ${o.name}`
         return "-"
      }},
      { key: "qtyLeft", label: "jumlah order", render: x => {
         const y = $podet.filter(z => z.poId === form.poId).find(z => z.id === (id ? x.podetId : x.id))
         if (y.ratio === 1) {
            return `${id ? y.qty : y.qtyLeft} ${y.unit}`
         }
         const o = $items.find(z => z.id === x.itemId)
         return `${id ? y.qty : y.qtyLeft} ${y.unit} ${y.ratio > 1 ? '(± '+(id ? y.qty : y.qtyLeft)*y.ratio+' '+o.unit1+')' : '' }`
      } },
      { key: "qty", label: "jumlah diterima", fontColor: x => x.qty > x.qtyLeft ? "text-green-500 font-bold" : (x.qty < x.qtyLeft ? "text-red-500 font-bold" : ""), render: x => {
         if (x.ratio === 1) {
            return `${x.qty} ${x.unit}`
         }
         const o = $items.find(y => y.id === x.itemId)
         return `${x.qty} ${x.unit} ${x.ratio > 1 ? '(± '+x.qty*x.ratio+' '+o.unit1+')' : '' }`
      } },
   ]
   
	let form = {...initialState}
   let formdet = {...initialStateDet}
   let info = {}
   let editState = {}
   let detail = []
   let loading = false
   let units = []
   let itemsFiltered = $items
   
   
   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1

   const editDetail = (i) => {editState = {...editState, [i]: true}}

   const updateDetail = (i) => {editState = {...editState, [i]: false}}

   const removeDetail = i => {
      detail = detail.filter((_, xi) => xi !== i)
   }

   const poChanged = () => {
      const po = $po.find(x => x.id === form.poId)
      const supplier = $suppliers.find(x => x.id === po.supplierId)

      info = {...info, supplierName: supplier.name, supplierPhone: supplier.phone, supplierAddress: supplier.address}
   }

   const addDetailRef = () => {
      const detailPo = $podet.filter(x => x.poId === form.poId)
      detail = [...detail, ...detailPo]
   }

   const resetRef = () => {
      form.poId = ""
      detail = []
   }

   const insert = () => {
      loading = true
      const log = JSON.stringify({...form, detail })      
      fetch.post(`/pd`, { ...form, detail, log }).then(res => {
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
      fetch.put(`/pd`, { ...form, detail, log }).then(res => {
         loading = false
         if (res.success) {            
            toast.success("Berhasil diubah",res.message)
            $goto("/pd")
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

   $: if (detail) {
      itemsFiltered = $items.filter(x => detail.findIndex(y => y.itemId === x.id) === -1)
   }

	onMount(() => {
      init("suppliers")
      init("warehouses")
      init("items")
      init("po")
      init("podet")
      init("pd")
      init("pddet").then(() => {
         if (action === "edit") {
            const data = getDataById("pd", id)
            const datadet = getDataArrayById("pddet", id, "pdId", true)
            form = { ...form, ...{...data, date: moment(data.date).format("YYYY-MM-DD")} }
            if (datadet.length > 0) {
               detail = datadet.sort((x, y) => x.id - y.id)
               poChanged()
            }
         }
      })
   })
</script>

<svelte:head>
	<title>{action === "edit" ? "Ubah" : "Buat"} Penerimaan Pembelian | {$appname}</title>
</svelte:head>

{#if $menu && allow("po", action)}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">{action === "edit" ? "Ubah" : "Buat"} Penerimaan Pembelian</h3>
      <Button 
         circle
         iconOnly
         icon="reply"
         color="red"
         textColor="white"
         on:click={() => $goto("/pd")} 
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
            <div class="control md:w-1/2">
               <Select bind:value={form.supplierId} items={$suppliers} itemId="id" itemLabel={x => `${x.name} ${x.address !== "" && x.address !== "-" ? "- " + x.address : ""}`} searchable disabled={detail.length > 0 || id} />
               <label>pemasok *</label>
            </div> 
            <div class="flex flex-col md:flex-row">
               <div class="control md:w-1/2">
                  <Select bind:value={form.poId} items={$po.filter(x => x.status < 2 && x.supplierId === form.supplierId)} itemId="id" itemLabel={x => `${moment(x.date).format("DD MMM YYYY")} - ${x.no} ${x.ref ? "("+x.ref+")" : ""}`} on:change={poChanged} searchable disabled={detail.length > 0 || id} />
                  <label>order pembelian *</label>
               </div> 
               <div class="flex justify-center items-end pb-2">
                  {#if detail.length === 0}
                     <Button 
                        color="green"
                        textColor="white"
                        disabled={detail.length > 0 || id || !form.poId || form.poId === ""}
                        on:click={addDetailRef}
                     >
                        pilih
                     </Button>
                  {:else}
                     {#if !id}
                        <Button 
                           color="red"
                           textColor="white"
                           on:click={resetRef}
                        >
                           reset
                        </Button>
                     {/if}
                  {/if}
               </div>
               <div class="control md:w-1/2">
                  <Select bind:value={form.warehouseId} items={$warehouses} itemId="id" itemLabel={x => `${x.name} ${x.address !== "" && x.address !== "-" ? "- " + x.address : ""}`} searchable disabled={id} />
                  <label>gudang *</label>
               </div> 
            </div> 
            {#if form.poId}
            <div class="flex flex-col md:flex-row"> 
               <div class="control md:w-1/2">
                  <label>{info.supplierName}</label>
                  <label>pemasok</label>
               </div> 
               <div class="control md:w-1/2">
                  <label>{info.supplierPhone}</label>
                  <label>no. telepon pemasok</label>
               </div> 
            </div>
            <div class="control">
               <label>{info.supplierAddress}</label>
               <label>alamat pemasok</label>
            </div>
            {/if}
            <div class="control">
               <Textarea bind:value={form.description} />
               <label>deskripsi</label>
            </div>
            <h4 class="mt-10 text-theme-500 text-md font-bold border-b border-theme">Detail</h4>
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
                           <td class={`${head.fontColor ? head.fontColor(data) : ""} px-4 py-2 border-l border-r border-t border-gray-200 min-w-42 md:min-w-0`}>
                              {#if editState[i] === true && head.key === "qty"}
                                 <div class="flex items-center">
                                    <Field bind:value={data[head.key]} />{#if head.key === "qty"} <span class="pl-2">{data.unit}</span>{/if} 
                                 </div>
                              {:else}
                                 {@html head.render ? head.render(data) : data[head.key]}
                              {/if}
                           </td>
                        {/each}
                        <td class="px-4 py-2 border-l border-r border-t border-gray-200 md:min-w-0">
                           <div class="flex justify-center">
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
                                    {#if !data.ppodetId && (!id && !data.id)}
                                    <Button
                                       disabled={!(!id && !data.id)}
                                       circle
                                       iconOnly
                                       icon="trash-alt"
                                       color="red"
                                       textColor="white"
                                       className="ml-4"
                                       on:click={() => removeDetail(i)}
                                    />                        
                                 {/if}
                              {/if}
                           </div>
                        </td>
                     </tr>
                  {/each}
                  {:else}
                     <tr>
                        <td colspan={heads.length + 2} class="text-center px-4 border-l border-r border-t border-gray-200">Tidak ada data.</td>
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
                     !form.poId || form.poId === "" ||
                     !form.warehouseId || form.warehouseId === "" ||
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