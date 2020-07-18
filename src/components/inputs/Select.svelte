<script>
   import { onMount, createEventDispatcher } from "svelte"
   import { fade } from "svelte/transition"
   import Fa from "svelte-fa"
   import { faSort } from "@fortawesome/pro-regular-svg-icons"
   
   export let value
   export let items = []
   export let itemId
   export let itemLabel
   export let disabled = false

   const dispatch = createEventDispatcher()

   let oldValue = ""
   let showOptions = false
   let index = -1   

   const handleOpen = () => {
      showOptions = true
      dispatch("click")
   }

   const handleClose = () => {
      showOptions = false
      dispatch("blur")
   }

   const handleClick = (item, i) => {
      index = i
      value = item[itemId]
      item[itemId]
   }

   const change = () => {
      if (items.length > 0) {
         const i = items.findIndex(x => x[itemId] === value)
         index = i
      }
   }

   onMount(() => {
      if (value !== "") {
         console.log("[select value set]", value)
      }      
   })

   $: value, change()
</script>

<button
   type="button"
   on:click|preventDefault={handleOpen}
   on:blur|preventDefault={handleClose}
   class={`${showOptions ? "rounded-t-lg" : "rounded-lg"} px-3 py-1 leading-7 flex justify-between items-center border border-gray-300 focus:border-theme transition-colors duration-300`} 
   {disabled}
>
   <span>
      {#if index !== -1}
         {items[index][itemLabel]}
      {:else}
         &nbsp;
      {/if}
   </span>
   <Fa icon={faSort} class="text-gray-500" />
</button>
{#if showOptions}
   <div out:fade class="relative animate-slide-in-down z-30">
      <div class="absolute w-full bg-white border-r border-l border-b border-theme rounded-b-lg shadow-lg top-34px">
         <ul class="pb-2">
            <li class="px-3 py-1 leading-7 hidden"></li>
            {#if items.length > 0}
               {#each items as item, i}
                  <li on:click={() => handleClick(item, i)} class={`${i === index ? "text-theme font-semibold" : "text-gray-600"} px-3 py-1 leading-7 border-t border-gray-100 cursor-pointer hover:bg-theme-100`}>{item[itemLabel]}</li>
               {/each}
            {:else}
               <li class="px-3 py-1 leading-7 cursor-not-allowed text-gray-400 text-center">Tidak ada data.</li>
            {/if}
         </ul>
      </div>
   </div>
{/if}

<style>
   .top-34px {
      top: 34px;
   }
</style>