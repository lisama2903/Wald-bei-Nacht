<script>
	export let src;
	export let flipped;
	export let onClick;
	export let isTrue;
	export let isWrong;
	export let isInactive;
</script>

<button
	class="card"
	style:transform={flipped ? "rotateY(0)" : "rotateY(180deg)"}
	style:--rotate={flipped ? "0deg" : "180deg"}
	class:true={isTrue}
	class:wrong={isWrong}
	class:inactive={isInactive}
	disabled={isInactive}
	aria-label="card"
	onclick={onClick}
>
	<div class="front">
		<img {src} alt="Monkey" />
	</div>
	<div class="back"></div>
	<!-- Use background prop -->
</button>

<style>
	.card {
		position: relative;
		aspect-ratio: 2.5 / 3.5;
		font-size: min(1vh, 0.25rem);
		height: 200px; /* Slightly larger height */
		width: 140px; /* Slightly larger width */
		background: var(--bg-1);
		border-radius: 2em;
		transform: rotateY(180deg);
		transform-style: preserve-3d;
		padding: 0;
		user-select: none;
		cursor: pointer;
		opacity: 1; /* Full opacity */
		border: 2px solid white; /* White border */
		transition:
			transform 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955),
			scale 0.4s ease,
			opacity 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53);
	}

	.card.inactive {
		opacity: 0.675;
		cursor: not-allowed;
		scale: 0.95;
	}

	.front,
	.back {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		backface-visibility: hidden;
		border-radius: 2em;
		border: 0.5 px solid white; /* White border */
		box-sizing: border-box;
		padding: 2em;
	}

	.front {
		background-color: var(--bg);
	}

	.back {
		transform: rotateY(180deg);
		width: 100%;
		height: 100%;
		background-image: radial-gradient(
				circle at center center,
				var(--bg),
				#181847
			),
			repeating-radial-gradient(
				circle at center center,
				var(--bg),
				var(--bg),
				10px,
				transparent 20px,
				transparent 10px
			);
		background-blend-mode: multiply;
	}

	.true {
		animation-name: tada;
		animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		animation-duration: 1.25s;
		animation-iteration-count: 1;
		z-index: 999;
	}

	.wrong {
		animation-name: shakeX;
		animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		animation-duration: 1.5s;
		animation-iteration-count: 1;
	}

	@keyframes shakeX {
		from,
		to {
			transform: translate3d(0, 0, 0) rotateY(var(--rotate));
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translate3d(-10px, 0, 0) rotateY(var(--rotate));
		}

		20%,
		40%,
		60%,
		80% {
			transform: translate3d(10px, 0, 0) rotateY(var(--rotate));
		}
	}

	@keyframes tada {
		from {
			transform: scale3d(1, 1, 1);
		}

		10%,
		20% {
			transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
		}

		30%,
		50%,
		70%,
		90% {
			transform: scale3d(1.125, 1.125, 1.125) rotate3d(0, 0, 1, 3deg);
		}

		40%,
		60%,
		80% {
			transform: scale3d(1.125, 1.125, 1.125) rotate3d(0, 0, 1, -3deg);
		}

		to {
			transform: scale3d(1, 1, 1);
		}
	}
</style>
