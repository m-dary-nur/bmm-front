<script>
	import { Router } from "@sveltech/routify"
	import { routes } from "@sveltech/routify/tmp/routes"

	import Tailwindcss from "./Tailwindcss.svelte"
</script>

<Tailwindcss />
<Router {routes} />

<style>
   @media only screen and (max-width: 768px) {
      :global(.scrolling-auto) {
        overflow-y: auto;
        height: calc(100vh - 105px);
      }
   }
   
   @media only screen and (min-width: 769px) {
      :global(.scrolling-auto) {
        overflow-y: auto;
        height: calc(100vh - 127px);
      }
   }
   
   :global(.shadow-bottom-bar) {
      box-shadow: 0px -5px 7px -7px rgba(0, 0, 0, 0.3);
   }
</style>
