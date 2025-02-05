<script>
	import { onMount } from "svelte";
	//import { navigate } from "svelte-spa-router";

	let glitterParticles = [];
	let fireflyParticles = [];
	let showGlitter = false;
	let showInfo = false;

	function createGlitter() {
		glitterParticles = []; // Reset particles
		const particleCount = 50; // Number of particles
		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * 2 * Math.PI;
			const radius = Math.random() * 120; // Random initial radius around the moon
			const x = Math.cos(angle) * radius + "px";
			const y = Math.sin(angle) * radius + "px";

			const size = (Math.random() * 4 + 3).toFixed(2) + "px"; // Random size
			const duration = (Math.random() * 10 + 8).toFixed(2) + "s"; // Animation duration

			// Subtle random movements
			const moveX = (Math.random() * 50 - 25).toFixed(2) + "px"; // Left and right movement
			const moveY = (Math.random() * 50 - 25).toFixed(2) + "px"; // Up and down movement

			glitterParticles.push({ x, y, size, duration, moveX, moveY });
		}
	}

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

	function handleMouseOver() {
		showGlitter = true;
		createGlitter(); // Regenerate particles on hover
	}

	function handleMouseOut() {
		showGlitter = false;
	}

	onMount(() => {
		createGlitter();
		createFireflies();
		const audio = document.querySelector("audio");
		audio.volume = 0.2;
	});
</script>

<div class="home-background">
	<audio src="/music/waldmusic.mp3" autoplay loop></audio>
	<div class="moon-container">
		{#if showGlitter}
			{#each glitterParticles as particle}
				<div
					class="glitter"
					style="
            --x: {particle.x};
            --y: {particle.y};
            --size: {particle.size};
            --duration: {particle.duration};
            --move-x: {particle.moveX};
            --move-y: {particle.moveY};
          "
				></div>
			{/each}
		{/if}
		<a href="#/spieleanleitung">
			<img
			src="/images/hintergrund/mond.svg"
			alt="Mond"
			class="moon"
			on:mouseover={handleMouseOver}
			on:mouseout={handleMouseOut}
		/>
		</a>
		
		<div class="tooltip">Wie spielt man?</div>
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

	<div class="content">
			<h1>Nachts im wilden Wald – Spiel und Spaß für kleine Entdecker!</h1>
		<a class="button" href="#/detektiv">Los geht's</a>
	</div>
</div>

<style>
	.home-background {
		background: url("/images/hintergrund/waldgruen.png");
		background-size: cover;
		background-position: center;

		width: 100%;
		margin: 0 ;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem;
		position: relative;
		
	}
	.content {
		margin-top: 6rem; /* Move content higher */
		z-index: 1;
	}
	h1 {
		color: #fff;
		font-family: "Bubblegum Sans";
		width: 852px;
		font-size: 64px;
		font-style: normal;
		font-weight: 400;
		line-height: 70px;
	}
	h2 {
		color: #0498ff;
		font-family: Andika;
		font-size: 24px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
		margin-bottom: 1rem; /* Add some space between h2 and h1 */
	}
	.button {
		margin-top: 2rem;
		padding: 0.75rem 1.5rem; /* Adjusted padding */
		font-size: 16px; /* Adjusted font size */
		font-family: "Andika", sans-serif;
		font-weight: 700;
		color: white;
		background-color: rgba(255, 223, 0, 0.8); /* Match fireflies' yellow color */
		border: none;
		cursor: pointer;
		text-decoration: none;
		border-radius: 10px; /* More rounded corners */
		transition: box-shadow 0.3s ease; /* Transition for the glow effect */
	}

	.button:hover {
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.8); /* White glow effect on hover */
	}
	.moon-container {
		position: absolute;
		top: 50px; /* Move moon further down */
		left: 50%;
		transform: translateX(-50%);
		width: 200px;
		height: 200px;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.moon {
		width: 200px;
		height: 200px;
		transition:
			transform 0.3s ease,
			filter 0.3s ease;
		position: relative;
		z-index: 2; /* Ensure it is above the glitter */
		cursor: pointer;
	}
	.moon:hover {
		filter: brightness(1.2);
	}
	.tooltip {
		position: absolute;
		top: 50%;
		left: 48%; /* Move text slightly more to the left */
		transform: translate(-50%, -50%);
		color: #003366; /* Dark blue text color */
		font-weight: bold; /* Bold text */
		text-align: center; /* Center text */
		padding: 0.5rem;
		border-radius: 5px;
		font-size: 14px;
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 3; /* Ensure it is above the moon */
	}
	.moon-container:hover .tooltip {
		visibility: visible;
		opacity: 1;
	}
	.glitter {
		position: absolute;
		width: var(--size, 5px);
		height: var(--size, 5px);
		top: 70px;
		left: 50%;
		background-color: rgba(255, 223, 0, 0.8); /* Warm yellow color */
		border-radius: 50%;
		animation:
			move-around var(--duration, 6s) infinite ease-in-out alternate,
			glow 2s infinite ease-in-out alternate;
		z-index: 0; /* Below the moon */
		box-shadow: 0 0 10px rgba(255, 223, 0, 0.8); /* Glow effect */
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
	}
	@keyframes move-around {
		0% {
			transform: translate(var(--x), var(--y));
		}
		50% {
			transform: translate(
				calc(var(--x) + var(--move-x, 20px)),
				calc(var(--y) + var(--move-y, 20px))
			);
		}
		100% {
			transform: translate(
				calc(var(--x) + var(--move-x, 40px)),
				calc(var(--y) + var(--move-y, 40px))
			);
		}
	}
	@keyframes glow {
		0% {
			opacity: 0.8;
		}
		100% {
			opacity: 1;
		}
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

	@media (max-width: 768px) {
		.content {
			margin-top: 5rem; /* Adjust for smaller screens */
			text-align: center;
		}

		h1 {
			width: 100%;
			font-size: 32px;
			line-height: 40px;
		}

		h2 {
			font-size: 18px;
		}

		.moon-container {
			top: 40px; /* Adjust for smaller screens */
			width: 150px;
			height: 150px;
		}

		.moon {
			width: 150px;
			height: 150px;
		}

		.button {
			font-size: 16px;
			padding: 0.5rem 1rem;
			border-radius: 10px; /* Adjusted rounded corners for smaller screens */
		}
	}
</style>
