<script>
    import { createEventDispatcher } from "svelte";
    
   export let value 
   export let disabled = false
   export let placeholder = ""


   const handleDisabled = e => { if (disabled) e.preventDefault() }
   const handleInput = e => {
      value = e.target.value
   }
</script>

<input 
   type="number"
   {value}
   on:keydown={handleDisabled}
   on:input={handleInput}
   {disabled}
   {placeholder}
   class="input-number px-3 py-1 leading-7 border border-gray-300 rounded-lg focus:border-theme transition-colors duration-300" 
   spellcheck="false" 
   autocomplete="off" 
/>

<style>
   .input-number::-webkit-outer-spin-button,
   .input-number::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
   }

   /* Firefox */
   .input-number[type=number] {
      -moz-appearance: textfield;
   }
</style>