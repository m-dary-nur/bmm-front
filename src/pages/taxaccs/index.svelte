<script>
   import { onMount } from "svelte"
   import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

   import { appname, menu } from "../../stores"
   import { init, taxaccs, taxtypes } from "../../stores/data"
   import fetch from "../../helpers/fetch"
   import PageUnauthorized from "../../components/PageUnauthorized.svelte"
   import ButtonAdd from "../../components/buttons/Add.svelte"
   import TableView from "../../components/TableView.svelte"   
   import { toast } from "../../components/toast"      

   const options = {
      datas: taxaccs,
      countLabel: "akun",
      heads: [
         { key: "isBankAcc", label: "akun bank", render: x => (x.isCenter === 1 ? "Ya" : "Bukan") },
         { key: "taxTypeId", label: "tipe akun", render: x => {
            const o = $taxtypes.find(y => y.id === x.taxTypeId)
            if (o) return o.name
            return "-"
         }},
         { key: "taxAccParentId", label: "akun induk", render: x => {
            const o = $taxaccs.find(y => y.id === x.taxAccParentId)
            if (o) return o.name
            return "-"
         }},
         { key: "no", label: "no. akun" },
         { key: "name", label: "nama akun" },
         { key: "active", label: "aktif", render: x => (x.active === 1 ? "Ya" : "Tidak") },
      ],
      actions: [
         {
            key: "taxaccs",
            action: "edit",
            label: "ubah",
            icon: "pencil-alt",
            iconClass: "text-yellow-500",            
            execute: data => $goto(`/taxaccs/${data.id}`),
         },
         {
            key: "taxaccs",
            action: "delete",
            label: "hapus",
            icon: "trash-alt",
            iconClass: "text-red-500",
            execute: data => {
               const label = data.name
               const isConfirm = window.confirm(`Apakah yakin menghapus pengguna "${label}" ?`)
               if (isConfirm) {
                  fetch.del(`/taxaccs/${data.id}`, { label }).then(res => {
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
      init("taxtypes")
      init("taxaccs")
   })
</script>

<svelte:head>
	<title>Akun Pajak | {$appname}</title>
</svelte:head>

{#if $menu && allow("taxaccs", "view")}
<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 md:px-8 ">
      <h3 class="text-theme text-lg font-bold">Akun Pajak</h3>
      <ButtonAdd on:click={() => $goto("/taxaccs/new")} disabled={$menu && !allow("taxaccs", "add")} />
   </div>
   <div class="w-full md:px-8">
      <TableView {...options} />
   </div>
</div>
{:else}
   <PageUnauthorized />
{/if}