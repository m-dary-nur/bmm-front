<script>
   import { onMount } from "svelte"
   import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

   import { appname, menu } from "../../stores"
   import { init, items } from "../../stores/data"
   import fetch from "../../helpers/fetch"
   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
   import ButtonAdd from "../../components/buttons/Add.svelte"
   import TableView from "../../components/TableView.svelte"   
   import { toast } from "../../components/toast"      

   const options = {
      datas: items,
      countLabel: "produk",
      heads: [
         { key: "code", label: "kode produk" },
         { key: "barcode", label: "barcode produk", render: x => x.barcode !== null && x.barcode !== "" ? x.barcode : "-" },
         { key: "barcodeSupplier", label: "barcode nasional", render: x => x.barcodeSupplier !== null && x.barcodeSupplier !== "" ? x.barcodeSupplier : "-" },
         { key: "name", label: "nama produk" },
         { key: "description", label: "deskripsi", render: x => x.description !== null && x.description !== "" ? x.description : "-" },
         { key: "active", label: "aktif", render: x => (x.active === 1 ? "Ya" : "Tidak") },
      ],
      actions: [
         {
            key: "items",
            action: "edit",
            label: "ubah",
            icon: "pencil-alt",
            iconClass: "text-yellow-500",            
            execute: data => $goto(`/items/${data.id}`),
         },
         {
            key: "items",
            action: "delete",
            label: "hapus",
            icon: "trash-alt",
            iconClass: "text-red-500",
            execute: data => {
               const label = data.name
               const isConfirm = window.confirm(`Apakah yakin menghapus pengguna "${label}" ?`)
               if (isConfirm) {
                  fetch.del(`/items/${data.id}`, { label }).then(res => {
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
      init("items")
   })
</script>

<svelte:head>
	<title>Produk | {$appname}</title>
</svelte:head>

{#if $menu && allow("items", "view")}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 md:px-8 ">
      <h3 class="text-theme text-lg font-bold">Produk</h3>
      <ButtonAdd on:click={() => $goto("/items/new")} disabled={$menu && !allow("items", "add")} />
   </div>
   <div class="w-full md:px-8">
      <TableView {...options} />
   </div>
</div>
{:else}
   <PageUnauthorized />
{/if}