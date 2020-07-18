<script>
   export let value
   export let disabled = false
   export let rows = 2
   export let placeholder = ""

   const handleDisabled = e => { if (disabled) e.preventDefault() }
</script>

<textarea 
   bind:value
   on:keydown={handleDisabled}
   {disabled}
   {rows}
   {placeholder}
   class="px-3 py-1 leading-7 border border-gray-300 rounded-lg focus:border-theme transition-colors duration-300" 
   spellcheck="false" 
   autocomplete="off"
/>