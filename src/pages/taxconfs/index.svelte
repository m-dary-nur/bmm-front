<script>
   import { onMount } from "svelte"
   import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

   import { appname, menu } from "../../stores"
   import { init, taxconfs, taxaccs } from "../../stores/data"
   import fetch from "../../helpers/fetch"
   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
   import Button from "../../components/buttons/Button.svelte"
   import TableView from "../../components/TableView.svelte"   
   import { toast } from "../../components/toast"      

   const options = {
      datas: taxconfs,
      countLabel: "setting pajak",
      heads: [
         { key: "code", label: "kode setting" },
         { key: "name", label: "nama setting pajak" },
         { key: "ratePc", label: "rate pajak", render: x => `${x.ratePc}%` },
         { key: "taxAccInId", label: "akun masukan", render: x => {
            const o = $taxaccs.find(y => y.id === x.taxAccInId)
            if (o) return o.name
            return ""
         }},
         { key: "taxAccOutId", label: "akun keluaran", render: x => {
            const o = $taxaccs.find(y => y.id === x.taxAccOutId)
            if (o) return o.name
            return ""
         }},
         { key: "description", label: "deskripsi" },
         { key: "active", label: "aktif", render: x => (x.active === 1 ? "Ya" : "Tidak") },
      ],
      actions: [
         {
            key: "taxconfs",
            action: "edit",
            label: "ubah",
            icon: "pencil-alt",
            iconClass: "text-yellow-500",            
            execute: data => $goto(`/taxconfs/${data.id}`),
         },
         {
            key: "taxconfs",
            action: "delete",
            label: "hapus",
            icon: "trash-alt",
            iconClass: "text-red-500",
            execute: data => {
               const label = data.name
               const isConfirm = window.confirm(`Apakah yakin menghapus pengguna "${label}" ?`)
               if (isConfirm) {
                  fetch.del(`/taxconfs/${data.id}`, { label }).then(res => {
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
      init("taxconfs")
   })
</script>

<svelte:head>
	<title>Setting Pajak | {$appname}</title>
</svelte:head>

{#if $menu && allow("taxconfs", "view")}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 md:px-8 ">
      <h3 class="text-theme text-lg font-bold">Setting Pajak</h3>
      <Button 
         circle
         iconOnly
         icon="plus"
         color="green"
         textColor="white"
         on:click={() => $goto("/taxconfs/new")} 
         disabled={$menu && !allow("taxconfs", "add")}
      />
   </div>
   <div class="w-full md:px-8">
      <TableView {...options} />
   </div>
</div>
{:else}
   <PageUnauthorized />
{/if}