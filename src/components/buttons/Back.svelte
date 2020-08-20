<script>
   import { createEventDispatcher } from "svelte"
   import Fa from "svelte-fa"
   import { faBackspace } from "@fortawesome/pro-regular-svg-icons"

   export let disabled = false

   const dispatch = createEventDispatcher()
   const handleClick = () => dispatch("click") 
</script>

<button
   on:click={handleClick}
   type="button"
   class="flex justify-center items-center px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg border-0 hover:bg-red-600 hover:shadow-sm transition-shadow duration-300"
   {disabled}
>
   <Fa icon={faBackspace} class="pr-2" /> kembali
</button>