<script>
   import { onMount } from "svelte"
   import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

   import { appname, menu } from "../../stores"
   import { init, warehouses, branches } from "../../stores/data"
   import fetch from "../../helpers/fetch"
   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
   import Button from "../../components/buttons/Button.svelte"
   import TableView from "../../components/TableView.svelte"   
   import { toast } from "../../components/toast"      

   const options = {
      datas: warehouses,
      countLabel: "gudang",
      heads: [
         { key: "branchId", label: "Cabang", render: x => {
            const o = $branches.find(y => y.id === x.branchId)
            if (o) return o.name
            return "-"
         }},
         { key: "name", label: "nama gudang" },
         { key: "phone", label: "no. telepon", render: x => x.phone !== null && x.phone !== "" ? x.phone : "-" },
         { key: "address", label: "alamat", render: x => x.address !== null && x.address !== "" ? x.address : "-" },
         { key: "active", label: "aktif", render: x => (x.active === 1 ? "Ya" : "Tidak") },
      ],
      actions: [
         {
            key: "warehouses",
            action: "edit",
            label: "ubah",
            icon: "pencil-alt",
            iconClass: "text-yellow-500",            
            execute: data => $goto(`/warehouses/${data.id}`),
         },
         {
            key: "warehouses",
            action: "delete",
            label: "hapus",
            icon: "trash-alt",
            iconClass: "text-red-500",
            execute: data => {
               const label = data.name
               const isConfirm = window.confirm(`Apakah yakin menghapus pengguna "${label}" ?`)
               if (isConfirm) {
                  fetch.del(`/warehouses/${data.id}`, { label }).then(res => {
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
      init("warehouses")
   })
</script>

<svelte:head>
	<title>Gudang | {$appname}</title>
</svelte:head>

{#if $menu && allow("warehouses", "view")}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 md:px-8 ">
      <h3 class="text-theme text-lg font-bold">Gudang</h3>
      <Button 
         circle
         iconOnly
         icon="plus"
         color="green"
         textColor="white"
         on:click={() => $goto("/warehouses/new")} 
         disabled={$menu && !allow("warehouses", "add")}
      />
   </div>
   <div class="w-full md:px-8">
      <TableView {...options} />
   </div>
</div>
{:else}
   <PageUnauthorized />
{/if}