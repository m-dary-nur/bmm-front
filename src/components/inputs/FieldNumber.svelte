<script>
   import { createEventDispatcher } from "svelte";
   
   export let value 
   export let disabled = false
   export let placeholder = ""


   const handleDisabled = e => { if (disabled) e.preventDefault() }
   const handleInput = e => {
      value = e.target.value
   }
   const handleClick = e => {
      e.target.select()
   }
</script>
    
    <input
       {value}
       on:keydown={handleDisabled}
       on:input={handleInput}
       on:click={handleClick}
       pattern="{String.raw`\d{3}.\d{3}.\d{3}-\d{2}`}"
       {disabled}
       {placeholder}
       class="px-3 py-1 leading-7 border border-gray-300 rounded-lg focus:border-theme transition-colors duration-300" 
       spellcheck="false" 
       autocomplete="off" 
    />