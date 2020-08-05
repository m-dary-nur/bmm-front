<script>
   import Fa from "svelte-fa"
   import { faCheck, faExclamation, faTimes, faInfo } from "@fortawesome/pro-regular-svg-icons"

   import { toaster } from "./index"

   const iconlist = {
      "check": faCheck,
      "exclamation": faExclamation,
      "times": faTimes,
      "info": faInfo,
   }

   $: if($toaster) {
      setTimeout(() => toaster.set(null), 3000)
   }
</script>

{#if $toaster}
<div class="fixed w-full wrapper">
   <div class="flex justify-center">
      <div class="animate-slide-in-down bg-white mx-auto rounded-lg border-gray-300 border p-3 shadow-lg">
         <div class="flex flex-row">
            <div class={`px-2 flex items-center ${$toaster.iconColor}`}>
               <Fa icon={$toaster.icon} class={$toaster.iconColor} size="2x" />
            </div>
            <div class="ml-2 mr-6">
               <span class="font-semibold">{$toaster.title}</span>
               <span class="block text-gray-500">{$toaster.message}</span>
            </div>
         </div>
      </div>
   </div>  
</div>
{/if}

<style>
.wrapper {
   top: 1rem;
}
</style>