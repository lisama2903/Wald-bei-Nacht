<script module>
	let srcAudio = "/music/waldmusic.mp3";

	export function startAudio(currentBackground) {
		switch (currentBackground) {
			case "Dschungel":
				srcAudio = "/music/Dschungel.wav";
				console.log("Dschungel");
				break;
			case "Waldwinter":
				srcAudio = "/music/winterwald.mp3";
				console.log("Winterwald");
				break;
			case "Waldgruen":
				srcAudio = "/music/waldmusic.mp3";
				console.log("Wald");
				break;
		}
	}
</script>

<script>
	import { onMount } from "svelte";

	let audio = null;

	onMount(() => {
		audio.volume = 1;
		audio.src = srcAudio;

		let promise = audio.play();

		if (promise !== undefined) {
			promise
				.then(() => {
					console.log("Audio is playing.");
				})
				.catch((error) => {
					console.error("Audio could not be played.", error);
				});
		}
	});
</script>

<audio bind:this={audio} loop autoplay></audio>
