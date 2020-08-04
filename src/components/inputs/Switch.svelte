<script>
   export let label = ""
   export let checked = false
   export let disabled = false
   const handleClick = () => checked = !checked
</script>

<label class={`${disabled && "cursor-not-allowed"} flex items-center text-md select-none cursor-pointer leading-loose whitespace-no-wrap`}>
   <input
      type="checkbox"
      bind:checked      
      class="switch hidden"
      {disabled}
   />
   <label on:click={handleClick} class={`${disabled ? "bg-gray-300" : checked ? "bg-theme" : "bg-gray-400"} switch-label mr-1 mt-px`}>
      <span class="switch-button" />
   </label> &nbsp;{label}
</label>