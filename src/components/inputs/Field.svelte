<script>
import { createEventDispatcher } from "svelte";

   export let type = "text"
   export let value 
   export let disabled = false
   export let placeholder = ""


   const handleDisabled = e => { if (disabled) e.preventDefault() }
   const handleInput = e => {
      value = e.target.value
   }
</script>

<input 
   type={type === "date" && disabled ? "text" : type}
   {value}
   on:keydown={handleDisabled}
   on:input={handleInput}
   {disabled}
   {placeholder}
   class="w-full px-3 py-1 leading-7 bg-transparent border border-gray-300 rounded-lg focus:border-theme transition-colors duration-300" 
   spellcheck="false" 
   autocomplete="off" 
/>