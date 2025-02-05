<script>
	import Card from "./Card.svelte";
	export let cardStates;
</script>

<div class="layout">
	{#each cardStates as _, i}
		<!-- <Card {i} flipped={true} onclick={() => {}} /> -->
	{/each}
</div>

<style>
	.layout {
		width: 100%;
		max-width: 512px;
		height: calc(100vh - 4rem);
		max-height: calc(100vh - 4rem);
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.layout :global(.card) {
		width: calc(100% / 3 - 1rem);
		height: calc(100% / 3 - 1rem);
		margin: 0.5rem;
	}

	.layout :global(.card-image) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 2em;
	}
</style>
