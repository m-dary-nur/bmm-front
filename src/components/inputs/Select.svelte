<script>
   import { onMount, createEventDispatcher } from "svelte"
   import { fade } from "svelte/transition"
   import Fa from "svelte-fa"
   import { faSort } from "@fortawesome/pro-regular-svg-icons"

   import highlight from "../../helpers/highlight";
   
   export let value
   export let items = []
   export let itemId
   export let itemLabel
   export let searchable = null
   export let disabled = false

   const dispatch = createEventDispatcher()

   let oldValue = ""
   let showOptions = false
   let index = -1   
   let staticFilteredItems = []
   let filteredItems = []
   let searchtext = ""

   const handleOpen = () => showOptions = true
   const handleClose = () => showOptions = false
   const handleClick = (item, i) => {
      index = i
      value = item[itemId]
      item[itemId]
      showOptions = false
      if (searchable) {
         searchtext = ""
         filteredItems = staticFilteredItems
      }
   }

   const change = () => {
      if (items.length > 0) {
         const i = items.findIndex(x => x[itemId] === value)
         index = i
      }
   }
   
   const optionLabel = x => {
      return typeof itemLabel === "string" ? x[itemLabel] : itemLabel(x)
   }

   const filterHandler = () => {
      const itemsFilter = items.map((x, i) => {
         const str = optionLabel(x)
         if (str.toLowerCase().includes(searchtext.toLowerCase())) {
            return i
         }
      })
      return itemsFilter
   }

   const filterList = () => {
      filteredItems = filterHandler()
   }

   const init = el => el.focus()

   $: if (value) {
      index = items.findIndex(x => x[itemId] === value)
   }
   
   $: if (items) {
      const showAll = filterHandler()
      staticFilteredItems = showAll
      filteredItems = showAll
   }


</script>

<div class="relative">
   <button
      type="button"
      on:click|preventDefault={handleOpen}
      on:blur|preventDefault={!searchable && handleClose}
      class={`w-full ${showOptions ? "border-l border-t border-r border-theme rounded-t-lg" : "border border-gray-300 rounded-lg"} px-3 py-1 leading-7 flex justify-between items-center transition-colors duration-300`} 
      {disabled}
   >
      <span>
         {#if index !== -1}
            {optionLabel(items[index])}
         {:else}
            &nbsp;
         {/if}
      </span>
      <Fa icon={faSort} class="text-gray-500" />
   </button>
   {#if showOptions}
      <div out:fade class="w-full mt-9 absolute left-0 top-0 animate-slide-in-down z-30">
         {#if searchable}
            <div class="bg-white px-3 py-2 border-l border-r border-theme">
               <input type="text" bind:value={searchtext} on:input={filterList} on:blur={handleClose} use:init class="w-full px-3 py-2 rounded-lg" placeholder="Cari..." spellcheck={false} />
            </div>
         {/if}
         <div class="select-option-wrapper absolute bg-white w-full pb-2 border-r border-l border-b border-theme rounded-b-lg shadow-lg">
            <ul>
               <li class="px-3 py-1 leading-7 hidden"></li>
               {#if items.length > 0}
                  {#each items as item, i}
                     <li on:click={() => handleClick(item, i)} class={`${filteredItems.indexOf(i) === -1 ? "hidden" : ""} ${i === index ? "text-theme font-semibold" : "text-gray-600"} px-3 py-1 leading-7 border-t border-gray-100 cursor-pointer hover:bg-theme-100`}>
                        {@html highlight(optionLabel(item), searchtext).join("")}</li>
                  {/each}
               {:else}
                  <li class="px-3 py-1 leading-7 cursor-not-allowed text-gray-400 text-center">Tidak ada data.</li>
               {/if}
            </ul>
         </div>
      </div>
   {/if}
</div>

<style>
   .select-option-wrapper {
      max-height: 200px;
      overflow-y: auto;
   }

   .mt-9 {
      top: 2.25rem;
   }
</style>