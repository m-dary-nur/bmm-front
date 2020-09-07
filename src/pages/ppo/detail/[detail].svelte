<script>
   import { onMount } from "svelte"
   import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"
   import moment from "moment"
   import Fa from "svelte-fa"
   import { faBackspace } from "@fortawesome/pro-regular-svg-icons"

   import { appname, branch, menu } from "../../../stores"
   import { init, getDataById, getDataArrayById, items } from "../../../stores/data"
   import PageUnauthorized from "../../../components/PageUnauthorized.svelte"   

   export let detail

   const today = moment().format("YYYY-MM-DD")
   const id = detail
   const heads = [
      { key: "dateRequired", label: "tgl. dibutuhkan", render: x => moment(x.dateRequired).format("DD MMM YYYY")},
      { key: "itemId", label: "produk", render: x => {
         const o = $items.find(y => y.id === x.itemId)
         if (o) return `${o.barcodeGlobal ? '('+o.barcodeGlobal+') ' : ''}${o.barcode} - ${o.name}`
         return "-"
      }},
      { key: "unit", label: "jumlah", align: "right", render: x => {
         if (x.ratio === 1) {
            return `${x.qty} ${x.unit}`
         }
         const o = $items.find(y => y.id === x.itemId)
         return `${x.qty} ${x.unit} ${x.ratio > 1 ? '(± '+x.qty*x.ratio+' '+o.unit1+')' : '' }`
      } },
   ]

   let dataHeader = {}
   let dataDetail = []

   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1   

   $: totalItem = dataDetail.length
   
   onMount(() => {
      init("items")
      init("ppo")
      init("ppodet").then(() => {
         const data1 = getDataById("ppo", id)
         const data2 = getDataArrayById("ppodet", id, "ppoId", true)
         dataHeader = {...dataHeader, ...data1}
         dataDetail = [...dataDetail, ...data2]
      })
   })
</script>

<svelte:head>
	<title>Detail Pre Order Pembelian | {$appname}</title>
</svelte:head>

{#if $menu && allow("ppo", "view")}
<div in:fade class="bg-gray-300 min-h-full pt-2 md:pt-8">
   <div class="relative flex justify-center items-center md:pt-6 px-2 md:px-24">
      <div class="absolute top-0 right-0 mr-16">
         <button
            on:click={$goto("/ppo")}
            type="button"
            class="flex justify-center items-center w-12 h-12 bg-red-500 text-white font-bold rounded-full shadow-lg border-0 hover:bg-red-600 hover:shadow-sm transition-shadow duration-300"
         >
            <Fa icon={faBackspace} />
         </button>
      </div>
      <div class="bg-white w-full border-1 border-gray-500 p-10 shadow-lg">

         <div class="flex justify-between mb-8">
            <div class="flex flex-col w-1/2 mr-10">
               <h1 class="text-left text-xl font-bold">{$branch.name}</h1>
               {#if $branch.address || $branch.address !== '-'}
                  <p class="text-left text-gray-600">{$branch.address}</p>
               {/if}
               {#if $branch.email || $branch.email !== '-'}
                  <p class="text-left text-gray-600">{$branch.email}</p>
               {/if}
               {#if $branch.phone || $branch.phone !== '-'}
                  <p class="text-left text-gray-600">{$branch.phone}</p>
               {/if}
            </div>
            <div class="flex flex-col items-end w-1/2">
               <h1 class="text-right text-xl font-bold mb-4">Pre Order Pembelian</h1>
               <img src="/logo.png" class="w-40" alt="logo" />
            </div>
         </div>

         <div class="flex justify-between items-start mb-8">
            <div class="flex flex-col w-3/6 mr-10"></div>
            <div class="w-1/6"></div>
            <div class="flex flex-col w-2/6">
               <div class="flex justify-between">
                  <p class="text-right font-bold">No. Transaksi:</p>
                  <p class="text-right">{dataHeader.no}</p>
               </div>
               <div class="flex justify-between">
                  <p class="text-right font-bold">Tgl. Transaksi:</p>
                  <p class="text-right">{moment(dataHeader.date).format("DD/MM/YYYY")}</p>
               </div>
            </div>
         </div>

         <table class="w-full mb-4">
            <thead>
               <tr>
                  {#each heads as head (head.key)}
                     <th class="bg-white sticky top-0 px-4 py-3 text-gray-500 font-semibold text-left shadow-th whitespace-no-wrap">
                        {head.label}
                     </th>
                  {/each}
               </tr>
            </thead>
            <tbody>
               {#if dataDetail.length > 0}
               {#each dataDetail as data, i (data.itemId)}
                  <tr class={(i % 2) > 0 ? "bg-gray-100" : ""}>
                     {#each heads as head (head.key)}
                        <td class={`px-4 py-2 border border-gray-200 min-w-42 md:min-w-0 ${head.align === "right" ? "text-right" : "text-left"}`}>
                           {@html head.render ? head.render(data) : data[head.key]
                        }</td>
                     {/each}
                  </tr>
               {/each}
               {:else}
                  <tr>
                     <td colspan="3" class="text-center px-4 py-2 border border-gray-200 min-w-42 md:min-w-0">Tidak ada data.</td>
                  </tr>
               {/if}
            </tbody>
         </table>

         <div class="flex justify-end mb-8">
            <div class="whitespace-pre-line flex flex-col w-3/6 px-4">
               {$branch.captionPurchase}
            </div>
            <div class="w-1/6"></div>
            <div class="flex flex-col w-2/6 px-4">
               <div class="flex justify-between">
                  <p class="text-right font-bold">JUMLAH PRODUK</p>
                  <p class="text-right border-b-2 bordr-gray-500">{totalItem}</p>
               </div>
            </div>
         </div>

      </div>
   </div>
</div>
{:else}
   <PageUnauthorized />
{/if}