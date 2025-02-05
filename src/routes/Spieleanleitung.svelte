<script>
	import { onMount } from "svelte";

	let fireflyParticles = [];

	function createFireflies() {
		fireflyParticles = []; // Reset particles
		const particleCount = 60; // Number of fireflies
		for (let i = 0; i < particleCount; i++) {
			const x = Math.random() * 100 + "vw";
			const y = Math.random() * 100 + "vh";

			// Subtle random movements
			const moveX = (Math.random() * 50 - 25).toFixed(2) + "px"; // Left and right movement
			const moveY = (Math.random() * 50 - 25).toFixed(2) + "px"; // Up and down movement

			const size = (Math.random() * 4 + 3).toFixed(2) + "px"; // Random size
			const glowDuration = (Math.random() * 3 + 2).toFixed(2) + "s"; // Random glow duration

			fireflyParticles.push({ x, y, moveX, moveY, size, glowDuration });
		}
	}

	onMount(() => {
		createFireflies();
	});
</script>

<div class="content">
	<h2>So spielst du das Spiel</h2>
	<p>Ein Tier ist in der Nacht durch das helle Mondlicht aufgewacht. Doch du kannst es nicht sehen – es versteckt sich in der Dunkelheit! Nur mit deinen Fragen und deinem Verstand kannst du es finden.</p>

	<h2>Das musst du tun</h2>
	<ol>
		<li>Das geheime Tier gibt einen ersten Hinweis über sich.</li>
		<li>Du stellst Fragen, um mehr über das Tier zu erfahren. Zum Beispiel: „Hast du Federn?“ oder „Lebst du im Wasser?“</li>
		<li>Das Tier antwortet immer ehrlich – aber nicht immer ganz eindeutig!</li>
		<li>Drehe alle Karten um, die nicht mehr passen.</li>
		<li>Wenn nur noch eine Karte übrig ist und sie das richtige Tier zeigt, hast du mit deinem Licht die Wahrheit entdeckt!</li>
	</ol>

	<p class="centered-bold yellow"><strong>Hör genau hin, stelle schlaue Fragen und folge dem Mondlicht.</strong></p>

	<p class="centered-bold yellow"><strong>Kannst du das Geheimnis der Nacht lüften?</strong></p>
</div>

{#each fireflyParticles as particle}
	<div
		class="firefly"
		style="
			left: {particle.x};
			top: {particle.y};
			--move-x: {particle.moveX};
			--move-y: {particle.moveY};
			--size: {particle.size};
			--glow-duration: {particle.glowDuration};
		"
	></div>
{/each}

<style>
	:global(body) {
		background-color: #181847; /* Dark background */
		color: white; /* White text */
		font-family: "Andika", sans-serif;
		font-size: 12pt; /* Set font size to 12pt */
		text-align: left; /* Align text to the left */
	}

	.content {
		margin-top: 9rem; /* Add margin to move content further down */
	}

	h1 {
		color: #0498ff;
		font-family: "Bubblegum Sans", sans-serif;
		font-size: 36px;
		text-align: center;
		margin-top: 2rem;
	}

	.intro {
		font-family: "Andika", sans-serif;
		font-size: 12pt; /* Set font size to 12pt */
		color: white;
		text-align: center;
		margin: 1rem 0;
	}

	h2 {
		font-family: "Andika", sans-serif;
		font-size: 24px;
		color: rgba(255, 223, 0, 0.8); /* Match fireflies' yellow color */
		margin-top: 2rem;
		text-align: center; /* Center the headings */
	}

	p, ol {
		font-family: "Andika", sans-serif;
		font-size: 12pt; /* Set font size to 12pt */
		color: white;
		line-height: 1.6;
		margin: 1rem 0;
		max-width: 600px; /* Limit the width of the text */
		margin-left: auto;
		margin-right: auto;
	}

	ol {
		padding-left: 1.5rem;
		text-align: left; /* Align list items to the left */
	}

	ol li {
		margin-bottom: 0.5rem;
	}

	.centered-bold {
		text-align: center;
		font-weight: bold;
	}

	.yellow {
		color: rgba(255, 223, 0, 0.8); /* Match fireflies' yellow color */
	}

	.firefly {
		position: absolute;
		width: var(--size, 5px);
		height: var(--size, 5px);
		background-color: rgba(255, 223, 0, 0.8); /* Warm yellow color */
		border-radius: 50%;
		animation:
			firefly-glow var(--glow-duration, 3s) infinite ease-in-out alternate,
			firefly-move 10s infinite ease-in-out alternate;
		box-shadow: 0 0 10px rgba(255, 223, 0, 0.8); /* Glow effect */
		z-index: 0; /* Behind the text */
	}

	@keyframes firefly-glow {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes firefly-move {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(var(--move-x), var(--move-y));
		}
	}

	footer {
		margin-top: 20rem; /* Add margin to move footer further down */
	}
</style>