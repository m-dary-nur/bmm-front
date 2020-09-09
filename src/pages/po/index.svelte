<script>
   import { onMount } from "svelte"
   import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"
   import moment from "moment"

   import { appname, menu } from "../../stores"
   import { init, po, suppliers } from "../../stores/data"
   import fetch from "../../helpers/fetch"
   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
   import Button from "../../components/buttons/Button.svelte"
   import TableView from "../../components/TableView.svelte"   
   import { toast } from "../../components/toast"      

   const options = {
      datas: po,
      countLabel: "order",
      heads: [
         { key: "date", label: "tanggal", render: x => moment(x.date).format("DD MMM YYYY") },
         { key: "no", label: "nomor" },
         { key: "ref", label: "referensi" },
         { key: "supplierId", label: "Pemasok", render: x => {
            const o = $suppliers.find(y => y.id === x.supplierId)
            if (o) return o.name
            return "-"
         }},
         { key: "description", label: "keterangan", render: x => x.description !== null && x.description !== "" ? x.description : "-" },
         { key: "status", label: "status", render: x => (x.status === 0 ? "belum selesai" : (x.status === 1 ? "sebagian" : (x.status === 2 ? "selesai" : "ditutup")))},
      ],
      actions: [
         {
            key: "po",
            action: "edit",
            label: "ubah",
            icon: "pencil-alt",
            iconClass: "text-yellow-500",     
            disabled: x => x.status > 0,       
            execute: data => $goto(`/po/${data.id}`),
         },
         {
            key: "po",
            action: "detail",
            label: "detail",
            icon: "file-alt",
            iconClass: "text-blue-500",      
            execute: data => $goto(`/po/detail/${data.id}`),
         },
         {
            key: "po",
            action: "delete",
            label: "hapus",
            icon: "trash-alt",
            iconClass: "text-red-500",
            disabled: x => x.status > 0,
            execute: data => {
               const label = data.no
               const isConfirm = window.confirm(`Apakah yakin menghapus pre order pembelian "${label}" ?`)
               if (isConfirm) {
                  fetch.del(`/po/${data.id}`, { label }).then(res => {
                     if (res.success) {
                        toast.success("Berhasil dihapus", res.message)
                     } else {
                        toast.danger("Gagal", res.message)
                     }
                  })
               }
            },
         },
      ],
   }   

   const allow = (key, action) => $menu.findIndex(x => x.key === key && x.action === action) !== -1   


   onMount(() => {
      init("po")
   })
</script>

<svelte:head>
	<title>Order Pembelian | {$appname}</title>
</svelte:head>

{#if $menu && allow("po", "view")}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 md:px-8 ">
      <h3 class="text-theme text-lg font-bold">Order Pembelian</h3>
      <Button 
         circle
         iconOnly
         icon="plus"
         color="green"
         textColor="white"
         on:click={() => $goto("/po/new")} 
         disabled={$menu && !allow("po", "add")}
      />
   </div>
   <div class="w-full md:px-8">
      <TableView {...options} />
   </div>
</div>
{:else}
   <PageUnauthorized />
{/if}