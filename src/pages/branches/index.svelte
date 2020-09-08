<script>
   import { onMount } from "svelte"
   import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

   import { appname, menu } from "../../stores"
   import { init, branches } from "../../stores/data"
   import fetch from "../../helpers/fetch"
   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
   import Button from "../../components/buttons/Button.svelte"
   import TableView from "../../components/TableView.svelte"   
   import { toast } from "../../components/toast"      

   const options = {
      datas: branches,
      countLabel: "cabang",
      heads: [
         { key: "isCenter", label: "cabang pusat", render: x => (x.isCenter === 1 ? "Pusat" : "-") },
         { key: "code", label: "kode transaksi" },
         { key: "name", label: "nama cabang" },
         { key: "email", label: "email" },
         { key: "phone", label: "telepon" },
         { key: "address", label: "alamat" },
         { key: "active", label: "aktif", render: x => (x.active === 1 ? "Ya" : "Tidak") },
      ],
      actions: [
         {
            key: "branches",
            action: "edit",
            label: "ubah",
            icon: "pencil-alt",
            iconClass: "text-yellow-500",            
            execute: data => $goto(`/branches/${data.id}`),
         },
         {
            key: "branches",
            action: "delete",
            label: "hapus",
            icon: "trash-alt",
            iconClass: "text-red-500",
            execute: data => {
               const label = data.name
               const isConfirm = window.confirm(`Apakah yakin menghapus pengguna "${label}" ?`)
               if (isConfirm) {
                  fetch.del(`/branches/${data.id}`, { label }).then(res => {
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
      init("branches")
   })
</script>

<svelte:head>
	<title>Cabang | {$appname}</title>
</svelte:head>

{#if $menu && allow("branches", "view")}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 md:px-8 ">
      <h3 class="text-theme text-lg font-bold">Cabang</h3>
      <Button 
         circle
         iconOnly
         icon="plus"
         color="green"
         textColor="white"
         on:click={() => $goto("/branches/new")} 
         disabled={$menu && !allow("branches", "add")}
      />
   </div>
   <div class="w-full md:px-8">
      <TableView {...options} />
   </div>
</div>
{:else}
   <PageUnauthorized />
{/if}