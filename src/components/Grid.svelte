<script>
	let { size = 4, cardStates, onclick } = $props();
	import Card from "./Card.svelte";
</script>

<div class="layout">
	<div class="grid" style:--size={size}>
		{#each cardStates as flipped, i}
			<Card {i} {flipped} {onclick} />
		{/each}
	</div>
</div>

<style>
	.grid {
		width: 100%;
		aspect-ratio: 1 / 1;
		display: grid;
		grid-template-columns: repeat(var(--size), 1fr);
		grid-template-rows: repeat(var(--size), 1fr);
	}
</style>
