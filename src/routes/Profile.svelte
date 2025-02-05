<script>
	let { params } = $props();
	import { location, querystring } from "svelte-spa-router";
	import { parse } from "qs";

	$inspect(params);
</script>

<h1>Profil</h1>
