<script>
	import { onMount } from "svelte"
	import { goto } from "@sveltech/routify"
   import Fa from "svelte-fa"
	import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons"
   import Cookies from "js-cookie"

	import fetch from "../helpers/fetch"
	import { logged, showSidebar, setSession } from "../stores"
	import Topbar  from "../components/Topbar.svelte"
	import Sidebar from "../components/Sidebar.svelte"
	import ToastPlacer from "../components/toast/ToastPlacer.svelte"

	let innerWidth
	let preload = true	

	onMount(async () => {
		showSidebar.set(innerWidth > 767)
		if (Cookies.get("my-session")) {	
         fetch.get(`/refresh`).then(res => {
            console.log(res.success)
            if (res.success) {
               setSession(res.data)
            } else {
               Cookies.remove("my-session")
               $goto("/login")   
            }
         })
		} else {
			if (location.pathname !== "/login") {
				$goto("/login")
			}
		}
		preload = false
   })   
</script>

<svelte:window bind:innerWidth={innerWidth} />
<div class={`${$logged ? "bg-white" : "text-gray-600"} w-full h-screen flex flex-no-wrap font-sans`}>
	{#if $logged && $showSidebar}
		<Sidebar />
	{/if}
	<div class="w-full overflow-y-hidden">
		{#if $logged}
			<Topbar />
		{/if}
		{#if !preload}
			<slot />
		{:else}
			<div class="w-full relative left-0 mt-20 px-4">
				<div class="flex justify-center items-center">
					<Fa icon={faSpinnerThird} size="2x" class="text-theme spin" />
					&nbsp; Loading...
				</div>
			</div>
		{/if}
	</div>
	<ToastPlacer />
</div>

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