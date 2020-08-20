<script>
   import { createEventDispatcher } from "svelte"   
   import Fa from "svelte-fa"
   import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons"

   export let loading = false   
   export let disabled = false

   const dispatch = createEventDispatcher()
   const handleClick = () => dispatch("click")   
</script>

<button
   on:click={handleClick}
   type="button"
   class="flex justify-center items-center px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg border-0 hover:bg-blue-600 hover:shadow-sm transition-shadow duration-300"
   {disabled}
>
   {#if loading}
   <div class="relative">
      <div class="absolute w-full flex justify-center">
         <Fa icon={faSpinnerThird} size="lg" class="text-white spin" />
      </div>
   </div>
   {/if}<slot />
</button>