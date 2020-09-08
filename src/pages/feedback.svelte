<script>
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
   import { goto } from "@sveltech/routify"

   import { appname } from "../stores"
   
   import fetch from "../helpers/fetch"

	import { toast } from "../components/toast"
	import Button from "../components/buttons/Button.svelte"
	import Field from "../components/inputs/Field.svelte"
	import Textarea from "../components/inputs/Textarea.svelte"
	import Select from "../components/inputs/Select.svelte"
	import Switch from "../components/inputs/Switch.svelte"

   const types = [
      { id: "bug", label: "bug" },
      { id: "revisi", label: "revisi" },
      { id: "fitur", label: "fitur" },
   ]

	const initialState = {
      type: "bug",
      title: "",
      description: "",
      urgent: false,
   }
   
	let form = {...initialState}
   let loading = false

   const insert = () => {
      loading = true
      const log = JSON.stringify(form)      
      fetch.post(`/feedbacks`, { ...form, log }).then(res => {
         loading = false
         if (res.success) {
            form = {...initialState}
            toast.success("Berhasil dikirim",res.message)
         } else {
            toast.danger("Gagal",res.message)
         }
      })
   }

	onMount(() => {
   
   })
</script>

<svelte:head>
	<title>Feedback | {$appname}</title>
</svelte:head>

<div in:fade class="pt-2 md:pt-8">
   <div class="flex justify-between items-center px-4 pb-4 md:px-8 border-b border-gray-200 md:border-transparent">
      <h3 class="text-theme text-lg font-bold">Form Feedback</h3>
   </div> 
   <div class="w-full md:pt-2 md:px-6 scrolling-auto">
      <div class="w-full md:w-10/12 xl:w-8/12 md:pr-4 md:border-r border-gray-300">
         <form class="w-full"> 
            <div class="control md:w-1/2">
               <Select bind:value={form.type} items={types} itemId="id" itemLabel="label" />
               <label>jenis *</label>
            </div>              
            <div class="control">
               <Field bind:value={form.title} />
               <label>judul *</label>
            </div>
            <div class="control">
               <Textarea bind:value={form.description} rows="4" />
               <label>deskripsi *</label>
            </div>
            <div class="control md:w-1/3">
               <Switch bind:checked={form.urgent} label="urgent / bersifat mendesak" />
            </div>
            <div class="sticky bottom-0 bg-white flex justify-between items-center p-2 mt-4 border-t border-gray-300 shadow-bottom-bar">
               <Button
                  color="theme"
                  textColor="white"
                  loading={loading}
                  on:click={insert}
                  disabled={
                     !form.title ||
                     form.title === "" ||
                     !form.description ||
                     form.description === ""
                  }
               >
                  Kirim
               </Button>
            </div>
         </form>
      </div>
   </div>   
</div>

