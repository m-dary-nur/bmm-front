<script>
   import { createEventDispatcher } from "svelte"   
   import Fa from "svelte-fa"
   import { faSpinnerThird, faReply, faPlus, faTrashAlt, faPencilAlt, faSave } from "@fortawesome/pro-regular-svg-icons"

   export let loading = false   
   export let disabled = false
   export let color = ""
   export let textColor = "black"
   export let iconOnly = false
   export let icon = null
   export let iconRight = null
   export let circle = false

   const iconlist = {
       "plus": faPlus,
       "reply": faReply,
       "trash-alt": faTrashAlt,
       "pencil-alt": faPencilAlt,
       "save": faSave,
   }

   const dispatch = createEventDispatcher()
   const handleClick = () => dispatch("click")  
</script>

<button
   on:click={handleClick}
   type="button"
   class={`flex justify-center items-center h-10 ${circle?"w-10":"px-4 py-2"} bg-${color}-500 text-${textColor} font-bold ${circle?"rounded-full":"rounded-lg"} shadow-lg border-0 hover:bg-${color}-600 hover:shadow-sm transition-shadow duration-300`}
   {disabled}
>
   {#if loading}
   <div class="relative">
       <div class="absolute w-full flex justify-center">
           <Fa icon={faSpinnerThird} size="lg" class={`text-${textColor} spin`} />
       </div>
   </div>
   {/if}{#if icon}<Fa icon={iconlist[icon]} class={`${!iconOnly ? "pr-2":""}`} /> {/if}{#if !iconOnly}<slot />{/if}{#if iconRight} <Fa icon={iconlist[iconRight]} class="pl-2" />{/if}
</button>