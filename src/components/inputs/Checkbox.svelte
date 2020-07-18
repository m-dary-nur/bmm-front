<script>
   import { fade } from "svelte/transition"
   import Fa from "svelte-fa"
   import { faCheckSquare, faSquare } from "@fortawesome/pro-regular-svg-icons"

   export let label = ""
   export let checked = false
   export let disabled = false

   $: icon = checked ? faCheckSquare : faSquare
</script>

<label class="flex justify-center items-center select-none cursor-pointer">
   <input type="checkbox" bind:checked {disabled} class="hidden" />
   <Fa {icon} size="lg" class={checked && "text-theme"} /> &nbsp;{label}
</label>