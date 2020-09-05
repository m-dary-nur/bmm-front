<script>
   import { onMount } from "svelte"
   import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

   import { appname, menu } from "../../stores"
   import { init, itemgroups, itemtypes } from "../../stores/data"
   import fetch from "../../helpers/fetch"
   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
   import ButtonAdd from "../../components/buttons/Add.svelte"
   import TableView from "../../components/TableView.svelte"   
   import { toast } from "../../components/toast"      

   const options = {
      datas: itemgroups,
      countLabel: "grup",
      heads: [
         { key: "name", label: "nama grup produk" },
         { key: "itemTypeId", label: "tipe grup produk", render: x => {
            const o = $itemtypes.find(y => y.id === x.itemTypeId)
            if (o) return o.name
            return ""
         }},
         { key: "active", label: "aktif", render: x => (x.active === 1 ? "Ya" : "Tidak") },
      ],
      actions: [
         {
            key: "itemgroups",
            action: "edit",
            label: "ubah",
            icon: "pencil-alt",
            iconClass: "text-yellow-500",            
            execute: data => $goto(`/itemgroups/${data.id}`),
         },
         {
            key: "itemgroups",
            action: "delete",
            label: "hapus",
            icon: "trash-alt",
            iconClass: "text-red-500",
            execute: data => {
               const label = data.name
               const isConfirm = window.confirm(`Apakah yakin menghapus pengguna "${label}" ?`)
               if (isConfirm) {
                  fetch.del(`/itemgroups/${data.id}`, { label }).then(res => {
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
      init("taxaccs")
      init("itemtypes")
      init("itemgroups")
   })
</script>

<svelte:head>
	<title>Grup Produk | {$appname}</title>
</svelte:head>

{#if $menu && allow("itemgroups", "view")}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 md:px-8 ">
      <h3 class="text-theme text-lg font-bold">Grup Produk</h3>
      <ButtonAdd on:click={() => $goto("/itemgroups/new")} disabled={$menu && !allow("itemgroups", "add")} />
   </div>
   <div class="w-full md:px-8">
      <TableView {...options} />
   </div>
</div>
{:else}
   <PageUnauthorized />
{/if}