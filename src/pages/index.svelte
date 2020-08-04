<script>
	import { fade } from "svelte/transition"
	import { goto } from "@sveltech/routify"
	import Cookies from "js-cookie"
	
	import { appname, personal } from "../stores"
</script>

<svelte:head>
	<title>Dashboard | {$appname}</title>
</svelte:head>

<div in:fade class="p-8">
   <h3 class="">Hai <b>{$personal && $personal.fullname}</b></h3>
</div>