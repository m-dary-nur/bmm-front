<script>
   import { onMount } from "svelte"
   import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

   import { appname, menu } from "../../stores"
   import { init, suppliers } from "../../stores/data"
   import fetch from "../../helpers/fetch"
   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
   import Button from "../../components/buttons/Button.svelte"
   import TableView from "../../components/TableView.svelte"   
   import { toast } from "../../components/toast"      

   const options = {
      datas: suppliers,
      countLabel: "pemasok",
      heads: [
         { key: "name", label: "nama pemasok" },
         { key: "email", label: "email", render: x => x.email !== null && x.email !== "" ? x.email : "-" },
         { key: "phone", label: "telp", render: x => x.phone !== null && x.phone !== "" ? x.phone : "-" },
         { key: "address", label: "alamat" },
         { key: "active", label: "aktif", render: x => (x.active === 1 ? "Ya" : "Tidak") },
      ],
      actions: [
         {
            key: "suppliers",
            action: "edit",
            label: "ubah",
            icon: "pencil-alt",
            iconClass: "text-yellow-500",            
            execute: data => $goto(`/suppliers/${data.id}`),
         },
         {
            key: "suppliers",
            action: "delete",
            label: "hapus",
            icon: "trash-alt",
            iconClass: "text-red-500",
            execute: data => {
               const label = data.name
               const isConfirm = window.confirm(`Apakah yakin menghapus pengguna "${label}" ?`)
               if (isConfirm) {
                  fetch.del(`/suppliers/${data.id}`, { label }).then(res => {
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
      init("suppliers")
   })
</script>

<svelte:head>
	<title>Pemasok | {$appname}</title>
</svelte:head>

{#if $menu && allow("suppliers", "view")}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 md:px-8 ">
      <h3 class="text-theme text-lg font-bold">Pemasok</h3>
      <Button 
         circle
         iconOnly
         icon="plus"
         color="green"
         textColor="white"
         on:click={() => $goto("/suppliers/new")} 
         disabled={$menu && !allow("suppliers", "add")}
      >
         baru
      </Button>
   </div>
   <div class="w-full md:px-8">
      <TableView {...options} />
   </div>
</div>
{:else}
   <PageUnauthorized />
{/if}