<script>
	import Grid from "./Grid.svelte";
	export let cardStates;
	export let handleCardFlip;
</script>

<div class="layout">
	<Grid size={3} {cardStates} onclick={handleCardFlip} />
</div>

<style>
	.layout {
		width: 100%;
		max-width: 512px;
		height: calc(100vh - 4rem); /* Adjust height to fit within viewport */
		max-height: calc(100vh - 4rem);
		margin: 0 auto;
	}
</style>
