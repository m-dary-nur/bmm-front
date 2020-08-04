<script>
   import { createEventDispatcher } from "svelte"
   import Fa from "svelte-fa"
   import { faPlus } from "@fortawesome/pro-regular-svg-icons"

   export let disabled = false

   const dispatch = createEventDispatcher()
   const handleClick = () => dispatch("click")   
</script>

<button
   on:click={handleClick}
   type="button"
   class="flex justify-center items-center px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 hover:shadow-sm transition-shadow duration-300"
   {disabled}
>
   <Fa icon={faPlus} class="pr-2" /> baru
</button>