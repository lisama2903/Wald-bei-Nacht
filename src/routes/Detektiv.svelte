<script>
	import { onMount } from "svelte";
	import openai, { generate, chat, getUserPrompt } from "../lib/openai";
	import Card from "../components/Card.svelte";
	import { Confetti } from "svelte-confetti";
	import {
		Snowflake,
		Trees,
		TreePalm,
		RotateCcw,
		Search,
	} from "lucide-svelte";

	/*

		richtig und falsch
		mit mind. 1 Frage oder ohne

		- ohne Frage
			- richtig: Check
			- falsch: Check
		- mit Frage
			- richtig: Check auch für den Fall, wo noch mind.1 Karte offen bleibt
			- falsch: Check
	
	*/

	let backgrounds = [
		"/images/hintergrund/dschungel.png",
		"/images/hintergrund/waldwinter.png",
		"/images/hintergrund/waldgruen.png",
	];
	let currentBackgroundIndex = 0;
	let currentBackground = backgrounds[currentBackgroundIndex];

	let images = {
		"/images/hintergrund/dschungel.png": [
			"/images/tieredschungle/affe.png",
			"/images/tieredschungle/chanel.png",
			"/images/tieredschungle/frosch.png",
			"/images/tieredschungle/giraffe.png",
			"/images/tieredschungle/jaguar.png",
			"/images/tieredschungle/kakadu.png",
			"/images/tieredschungle/kroko.png",
			"/images/tieredschungle/tiger.png",
		],
		"/images/hintergrund/waldwinter.png": [
			"/images/tiereschnee/baer.png",
			"/images/tiereschnee/dachs.png",
			"/images/tiereschnee/elch.png",
			"/images/tiereschnee/fuchs.png",
			"/images/tiereschnee/hirsch.png",
			"/images/tiereschnee/luchs.png",
			"/images/tiereschnee/schneeeule.png",
			"/images/tiereschnee/schneehase.png",
		],
		"/images/hintergrund/waldgruen.png": [
			"/images/tierewald/eichhorn.png",
			"/images/tierewald/eule.png",
			"/images/tierewald/fledermaus.png",
			"/images/tierewald/hase.png",
			"/images/tierewald/igel.png",
			"/images/tierewald/reh.png",
			"/images/tierewald/wiesel.png",
			"/images/tierewald/wolf.png",
		],
	};

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

	let currentGroup = "Group-1";
	let audio;
	function switchBackground() {
		resetGame();

		currentBackgroundIndex =
			(currentBackgroundIndex + 1) % backgrounds.length;
		currentBackground = backgrounds[currentBackgroundIndex];

		switch (currentBackground) {
			case "/images/hintergrund/dschungel.png":
				audio.src = "/music/Dschungel.wav";
				currentGroup = "Group-1";
				break;
			case "/images/hintergrund/waldwinter.png":
				audio.src = "/music/winterwald.mp3";
				currentGroup = "Group-2";
				break;
			case "/images/hintergrund/waldgruen.png":
				audio.src = "/music/waldmusic.mp3";
				currentGroup = "Group-3";
				break;
		}
	}

	function switchToDschungel() {
		resetGame();
		currentBackground = "/images/hintergrund/dschungel.png";
		audio.src = "/music/Dschungel.wav";
		currentGroup = "Group-1";
	}

	function switchToWinter() {
		resetGame();
		currentBackground = "/images/hintergrund/waldwinter.png";
		audio.src = "/music/winterwald.mp3";
		currentGroup = "Group-2";
	}

	function switchToWald() {
		resetGame();
		currentBackground = "/images/hintergrund/waldgruen.png";
		audio.src = "/music/waldmusic.mp3";
		currentGroup = "Group-3";
	}

	function getCardBackground(currentBackground) {
		switch (currentBackground) {
			case "/images/hintergrund/dschungel.png":
				return "#296753";
			case "/images/hintergrund/waldwinter.png":
				return "#253A5C";
			case "/images/hintergrund/waldgruen.png":
				return "#181847";
			default:
				return "white";
		}
	}

	onMount(() => {
		currentBackground = backgrounds[currentBackgroundIndex];
		createFireflies();
	});

	// Für das System
	let randomAnimal = null;
	let randomAnimalIndex = null;
	let hasGuessedRight = false;
	let wikiInfo = null;
	let statements = null;
	// HIER
	let hasStarted = false;

	// Von der User:in
	let question = "";
	let messages = [];
	let uiHint = "";

	let groupOfAnimals = {
		"Group-1": [
			{
				name: "Monkey",
				important: true,
			},
			{
				name: "Cameleon",
				important: true,
			},
			{
				name: "Frog",
				important: true,
			},
			{
				name: "Giraffe",
				important: true,
			},
			{
				name: "Jaguar",
				important: true,
			},
			{
				name: "Tucan",
				important: true,
			},
			{
				name: "Crocodile",
				important: true,
			},
			{
				name: "Tiger",
				important: true,
			},
		],
		"Group-2": [
			{
				name: "Bär",
				important: true,
			},
			{
				name: "Dachs",
				important: true,
			},
			{
				name: "Elch",
				important: true,
			},
			{
				name: "Fuchs",
				important: true,
			},
			{
				name: "Hirsch",
				important: true,
			},
			{
				name: "Luchs",
				important: true,
			},
			{
				name: "Schnee-Eule",
				important: true,
			},
			{
				name: "Schnee-Hase",
				important: true,
			},
		],
		"Group-3": [
			{
				name: "Eichhörnchen",
				important: true,
			},
			{
				name: "Eule",
				important: true,
			},
			{
				name: "Fledermaus",
				important: true,
			},
			{
				name: "Hase",
				important: true,
			},
			{
				name: "Igel",
				important: true,
			},
			{
				name: "Reh",
				important: true,
			},
			{
				name: "Wiesel",
				important: true,
			},
			{
				name: "Wolf",
				important: true,
			},
		],
	};

	async function askWiki(titles) {
		const response = await fetch(
			`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(titles)}&origin=*`
		);
		const data = await response.json();

		// Extract the first page from the response (Source: https://stackoverflow.com/questions/8555320/is-there-a-wikipedia-api-just-for-retrieve-the-content-summary)
		const query = data.query.pages;
		const keys = Object.keys(query)[0];
		const result = query[keys].extract;
		return result;
	}

	// CHECK: Migrated to the OpenAI API
	async function generateAnimal() {
		// Generiere zufälliges Tier für uns
		isLoading = true;
		let animals = groupOfAnimals[currentGroup].map((animal) => animal.name); // Check
		randomAnimalIndex = Math.floor(Math.random() * animals.length);
		randomAnimal = animals[randomAnimalIndex]; // Check

		// Frage Wiki nach Informationen
		const info = await askWiki(randomAnimal); // Check
		wikiInfo = info; // Check

		// Generiere fünf Fragen basierend auf dem Text, den ich bereitgestellt habe
		const prompt = getUserPrompt(randomAnimal, wikiInfo); // Check

		try {
			// Generiere synthetische Daten
			const { message } = await generate(prompt);
			const response = message.content;

			// Statements, die zuvor eine Liste waren, nun als String formatiert, damit sie dann über das Netzwerk geschickt werden können
			statements = [...JSON.parse(response)?.statements]
				.map((item, index) => `Aussage ${index + 1}: ` + item)
				.join(" ----- ");

			console.log("##### Derzeitiger Stand #####");
			console.log(randomAnimal);
			console.log(wikiInfo);
			console.log(statements);

			if (!hasStarted) {
				hasStarted = true;
			}
		} catch (e) {
			console.error(e);
		}
		isLoading = false;
	}

	let isLoading = false;
	let aiResponses = [];

	async function askAI() {
		if (statements.length === 0) {
			console.log("Bitte generiere zuerst Tierinformationen!");
			return;
		}

		// Setze Systemmessage (bei OpenAI: developer)
		if (messages.length === 0) {
			messages.push({
				role: "developer",
				content: `
					Dies ist ein Ratespiel! Du bist ein spielerischer Chatbot, der die Herausforderung "Wer bin ich?" annimmt.
					In "Wer bin ich" verkörperst du ein gegebenes Tier, das wir nicht kennen! Dann stellen wir dir weiterhin Fragen
					über das unbekannte Tier. Zur Referenz erhältst du fünf Aussagen, die du überprüfen kannst, um zu elaborieren,
					ob der Benutzer richtig oder falsch liegt. Hier sind die Anweisungen:

					a. Das Tier, das du verkörperst: ${randomAnimal} (BITTE SAGE NIEMANDEM DAVON! ES IST TOP SECRET)
					b. Die Tiere, aus denen der Benutzer wählen kann (die jeder frei sehen kann): ${groupOfAnimals[
						currentGroup
					]
						.map((animal) => animal.name)
						.join(", ")}
					c. Die Aussagen über dein Tier (BITTE SAGE NIEMANDEM DAVON! ES IST TOP SECRET):
					${statements}

					Du musst die folgenden Regeln befolgen:
					1. Sei so streng und unnachgiebig wie möglich. Mach es nicht einfach, dein Tier zu erraten!
					2. Gib keine offensichtlichen Hinweise und Enthüllungen, es sei denn, der Benutzer liegt völlig richtig und nennt das Tier beim genauen Namen!
					3. Nenne das Tier niemals oder enthülle es nicht beim Namen. Sei schlau und clever und gib Hinweise, WENN NÖTIG UNTER ALLEN UMSTÄNDEN.

					Was du tun kannst und tun solltest:
					- Du kannst wie ein Kind sprechen, da die Zielgruppe kleinere Kinder (8 - 10 Jahre) sind
					- Wenn der Benutzer wirklich keine Ahnung hat oder stecken bleibt, gib Hinweise. Aber nur, wenn sie um Hilfe bitten! 

					Wie du antworten solltest:
					a. answer: Sage nur wahr oder falsch für die aktuelle Antwort
					b. userHasGuessedRight: Wenn du zugeben kannst, dass der Benutzer das Tier richtig erraten hat, sage wahr. Andernfalls sage falsch.
					c. hint: Wenn der Benutzer um einen Hinweis bittet oder du das Gefühl hast, zusätzlichen Kommentar zu geben, gib einen Hinweis. Andernfalls gib keinen Hinweis!
					d. Antworte bitte in der Ich-Perspektive, um die Illusion aufrechtzuerhalten,
				`,
			});
		}

		// Sanitize and pre-process question before it it will be sent to OpenAI
		let q = /\?\s*$/.test(question)
			? question.replace(/\s*\?\s*/g, "?")
			: question.replace(/[\.\:\;\+]*/g, "").trim() + "?";
		console.log(q);

		// Stelle dir Frage an das System mit der Usermessage
		messages.push({
			role: "user",
			content: q,
		});
		question = "";

		// Bekomme nur die Assistentmessage zurück
		const response = await chat(messages);
		const { answer, userHasGuessedRight, hint } = JSON.parse(
			response.message.content
		);

		console.log(answer ? "Yes" : "No");
		console.log(userHasGuessedRight ? "Erraten!" : "Weiter raten");
		console.log(hint ?? "Kein Hint gegeben");

		uiHint = hint ?? "Kein Hint gegeben";

		aiResponses.push({
			answer: answer ? "Ja" : "Nein",
			userHasGuessedRight: userHasGuessedRight
				? "Erraten!"
				: "Weiter raten",
			hint: hint ?? "Kein Hint gegeben",
		});

		let numRounds = messages.slice(1).length / 2;
		hasGuessedRight = userHasGuessedRight;

		if (numRounds >= 5) {
			alert(
				"Maximale Rundenanzahl erreicht. Spiel wird vorzeitig beendet."
			);
			// Weitere Effeckte wie Confetti
			resetGame();
			return;
		}

		if (hasGuessedRight) {
			console.log("Spiel wurde erfolgreich beendet");

			hasGuessedRight = true;
			endMessage = "Du hast mich entdeckt! Ich bin " + randomAnimal;
			uiHint = "Du hast mich entdeckt! Ich bin " + randomAnimal;
			showConfetti = true;

			setTimeout(() => {
				hasStarted = false;
				resetGame();
			}, 5_000);
			return;
		}
	}

	async function excludeAnimals(messages, cards) {
		const newMessages = [...messages];
		const newUserMessage = [
			{
				role: "user",
				content: `
				Please exclude the animals that you think are NOT IMPORTANT for the next rounds. 
				Your task is to provide the indices of the animals you WANT TO EXCLUDE FROM FURTHER PROCEDING. 

				Taking the preceding conversation, you have to decide which animals do not matter for the next rounds.
				Here are the animals you can choose from:
				${cards.map(({ name, important }, index) => `At index ${index}: ${name} is ${important ? "highly important for the consecutive game\n" : "is not relevant anymore / has been excluded\n"}`)}

				For instance, if you want to exclude the first, the third and the fourth animal, you can provide the following indices: [0, 2, 3]
			`,
			},
		];

		const completion = await chat(newMessages.concat(newUserMessage), {
			type: "json_schema",
			json_schema: {
				name: "exclusion_schema",
				schema: {
					type: "object",
					properties: {
						indices: {
							type: "array",
							items: {
								type: "number",
								description:
									"An index starting from 0 for a corresponding animal from the original array. This is the index to classify the animal as no longer important for furhter game rounds.",
							},
						},
					},
				},
			},
		});

		// @ts-ignore
		const indices = JSON.parse(completion.message.content).indices;
		console.log(indices);
	}

	const deactivateCards = (currentAnimals, indices) => {
		let newArray = [...currentAnimals];
		for (let index of indices) {
			newArray[index].important = false;
		}
		return newArray;
	};

	const functions = {
		deactivateCards,
	};

	let showConfetti = false;

	function resetGame() {
		randomAnimal = null;
		randomAnimalIndex = null;
		hasGuessedRight = false;
		wikiInfo = null;
		statements = null;
		messages = [];
		aiResponses = [];
		endMessage = "";
		uiHint = "";
		showConfetti = false;

		// Iterate through all animals to set them to important again
		groupOfAnimals = {
			...groupOfAnimals,
			[currentGroup]: groupOfAnimals[currentGroup].map(({ name }) => ({
				name,
				important: true,
			})),
		};
	}

	function onCardFlip(i) {
		if (!randomAnimal) return;

		const arr = groupOfAnimals[currentGroup];
		const arrImportants = arr.map((animal) => animal.important);

		// Hey, check nur, ob der User nicht alle Karten aus Versehen zu macht
		let isOpen = groupOfAnimals[currentGroup][i].important;
		let atLeastOne = arrImportants.filter(Boolean).length === 1;
		if (atLeastOne && isOpen) {
			return alert(
				"Du musst mindestens eine Karte offen lassen, um das Spiel fortzusetzen!"
			);
		}

		groupOfAnimals = {
			...groupOfAnimals,
			[currentGroup]: groupOfAnimals[currentGroup].map(
				(animal, index) => {
					if (index === i) {
						return {
							...animal,
							important: !animal.important,
						};
					}
					return animal;
				}
			),
		};

		let allOpenedCards = groupOfAnimals[currentGroup].filter(
			(animal) => animal.important
		);

		if (allOpenedCards.length === 1) {
			if (allOpenedCards[0].name === randomAnimal) {
				hasGuessedRight = true;
				endMessage = "Du hast mich entdeckt! Ich bin " + randomAnimal;
				uiHint = "Du hast mich entdeckt! Ich bin " + randomAnimal;
				showConfetti = true;

				setTimeout(() => {
					hasStarted = false;
					resetGame();
				}, 5_000);
			} else {
				hasGuessedRight = false;
				endMessage =
					"Du hast das falsche Tier gefunden. Es schläft noch.";
				uiHint = "Du hast das falsche Tier gefunden. Es schläft noch.";

				setTimeout(() => {
					hasStarted = false;
					resetGame();
				}, 5_000);
			}
		}
	}

	let endMessage = "";
	$: if (groupOfAnimals[currentGroup]) {
		const arr = groupOfAnimals[currentGroup];
		const arrImportants = arr.map((animal) => animal.important);
		console.log(arrImportants);

		// Check nur, ob die letzte Karte tatsächlich das gesuchte Tier ist
		let allOpenedCards = groupOfAnimals[currentGroup].filter(
			(animal) => animal.important
		);
		console.log(allOpenedCards);

		if (allOpenedCards.length === 1) {
			if (allOpenedCards[0].name === randomAnimal) {
				hasGuessedRight = true;
				endMessage = "Du hast mich entdeckt! Ich bin " + randomAnimal;
			} else {
				hasGuessedRight = false;
				endMessage =
					"Du hast das falsche Tier gefunden. Es schläft noch.";
			}
			setTimeout(() => {
				hasStarted = false;
				resetGame();
			}, 5_000);
		}
	}

	$: {
		const buttonBgColor = getCardBackground(currentBackground);
		document.documentElement.style.setProperty(
			"--button-bg-color",
			buttonBgColor
		);
	}
</script>

<div class="background" style="background-image: url({currentBackground});">
	<audio bind:this={audio} src="/music/Dschungel.wav" loop autoplay></audio>

	<div class="button-group">
		<button
			class="view-button dschungel-button {currentBackground ===
			'/images/hintergrund/dschungel.png'
				? 'active'
				: ''}"
			on:click={switchToDschungel}
		>
			<TreePalm />
		</button>
		<button
			class="view-button winter-button {currentBackground ===
			'/images/hintergrund/waldwinter.png'
				? 'active'
				: ''}"
			on:click={switchToWinter}
		>
			<Snowflake />
		</button>
		<button
			class="view-button wald-button {currentBackground ===
			'/images/hintergrund/waldgruen.png'
				? 'active'
				: ''}"
			on:click={switchToWald}
		>
			<Trees />
		</button>
	</div>

	{#if hasGuessedRight}
		<div class="firefly-confetti">
			{#each Array(100) as _, i}
				<div
					class="firefly tada"
					style="--move-x: {Math.random() * 100 -
						50}px; --move-y: {Math.random() * 100 - 50}px;"
				></div>
			{/each}
		</div>
		{#if showConfetti}
			<Confetti />
		{/if}
	{/if}

	<div class="group" style="margin-top: 9rem;">
		<input
			class="search-bar"
			placeholder="Frag mich etwas ..."
			disabled={!hasStarted}
			bind:value={question}
			on:change={askAI}
		/>
		<button
			class="action-button"
			disabled={hasStarted}
			on:click={generateAnimal}
		>
			<Search
				style="width: 16px; height: 16px; position: relative; top: -2px;"
			/>
			<span>Such mich!</span>
			{#if isLoading}
				<span
					class="loading-spinner"
					style="translate: 0 .125rem; margin-left: 0.5rem;"
				></span>
			{/if}
		</button>
	</div>

	<p class="hint"><strong>Antwort:</strong> {uiHint}</p>

	<div class="container">
		{#each groupOfAnimals[currentGroup] as animal, i (animal.name)}
			<div>
				<Card
					src={images[currentBackground][i]}
					flipped={animal.important}
					onClick={() => onCardFlip(i)}
					isInactive={!hasStarted}
					isTrue={endMessage && endMessage.includes(animal.name)}
					isWrong={uiHint ===
						"Du hast das falsche Tier gefunden. Es schläft noch."}
					--bg={getCardBackground(currentBackground)}
				/>
			</div>
		{/each}
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

	<button
		class="restart-button view-button"
		on:click={() => {
			hasStarted = false;
			resetGame();
		}}
		disabled={!hasStarted}
	>
		<RotateCcw />
	</button>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		grid-template-rows: repeat(auto-fill, minmax(200px, 1fr));
		grid-template-columns: 1;
		max-width: 652px;
		margin: 0 auto;
		padding: 0;
		display: grid;
		transition: width 0.3s ease;

		max-width: 90%;
		gap: 0.25rem 0;
	}

	@media only screen and (min-width: 320px) {
		.container {
			grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
			max-width: 290px;
		}
	}

	@media only screen and (min-width: 560px) {
		.container {
			max-width: 435px;
		}
	}
	@media only screen and (min-width: 768px) {
		.container {
			max-width: 578px;
		}
		.group {
			display: flex;
			width: 100%;
			justify-content: center;
			gap: 0.5rem;
		}
		.group input {
			font-size: 14px;
			margin: 0;
		}
		.group button {
			white-space: nowrap;
		}
	}

	.container > div {
		flex: 0 0 auto; /* Ensure cards do not shrink */
		display: flex;
		align-items: center;
		justify-content: center;
		perspective: 100vh;
	}

	.hint {
		margin: 2rem 0;
		background-color: rgba(255, 255, 255, 0.8); /* Light background */
		padding: 1rem; /* Add padding */
		border-radius: 10px; /* Rounded corners */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
		color: #003366; /* Dark blue text color */
	}

	.card {
		width: 140px; /* Slightly larger width */
		height: 200px; /* Slightly larger height */
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "Andika", sans-serif;
		font-weight: 700;
		color: white;
		position: relative;
		border: 2px solid white; /* White border */
		opacity: 1; /* Full opacity */
	}

	.card img {
		max-width: 80%;
		max-height: 80%;
		object-fit: contain;
	}

	h1 {
		color: white;
		font-family: Andika;
		font-size: 22px;
		font-style: normal;
		font-weight: 700;
		line-height: 34px; /* 154.545% */
		text-align: left;
		margin-left: 1rem;
	}
	.background {
		width: 100vw;
		min-height: 100vh;
		background-size: cover;
		background-position: center;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: relative;
	}
	.button {
		margin-top: 2rem;
		padding: 1rem 2rem;
		font-size: 18px;
		font-family: "Andika", sans-serif;
		font-weight: 700;
		color: white;
		background-color: #0498ff;
		border: none;
		cursor: pointer;
		text-decoration: none;
	}
	.button-group {
		position: absolute;
		top: 20%; /* Move buttons further up */
		right: 2rem; /* Move buttons slightly more to the left */
		display: flex;
		flex-direction: column;
		gap: 0.5rem; /* Space between buttons */
		transform: translateY(-50%);
	}
	.view-button {
		padding: 0.5rem 1rem; /* Adjusted padding */
		font-size: 14px; /* Adjusted font size */
		font-family: "Andika", sans-serif;
		font-weight: 700;
		color: white;
		background-color: var(--button-bg-color); /* Dynamic background color */
		border: none;
		cursor: pointer;
		text-decoration: none;
		border-radius: 10px; /* More rounded corners */
		position: relative; /* For positioning the hover image */
		overflow: hidden; /* Hide the hover image initially */
		transition: box-shadow 0.3s ease; /* Transition for the glow effect */
		width: auto; /* Auto width */
		text-align: center; /* Center the text */
		height: 40px; /* Adjusted height */
	}
	.view-button:hover {
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.8); /* White glow effect on hover */
	}
	.view-button.active {
		box-shadow: 0 0 15px rgba(255, 255, 255, 1); /* Stronger glow effect for active button */
	}
	.dschungel-button::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url("/images/hintergrund/dschungel.png");
		background-size: cover;
		background-position: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.dschungel-button:hover::after {
		opacity: 1;
	}
	.winter-button::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url("/images/hintergrund/waldwinter.png");
		background-size: cover;
		background-position: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.winter-button:hover::after {
		opacity: 1;
	}
	.wald-button::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url("/images/hintergrund/waldgruen.png");
		background-size: cover;
		background-position: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.wald-button:hover::after {
		opacity: 1;
	}
	.cards-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
		z-index: 1;
	}
	.card {
		width: 150px;
		height: 200px;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "Andika", sans-serif;
		font-weight: 700;
		color: white;
		position: relative;
		border: 2px solid white; /* White border */
	}
	.card img {
		max-width: 80%;
		max-height: 80%;
		object-fit: contain;
	}
	.search-bar {
		margin-top: 1rem;
		width: 80%;
		max-width: 400px;
		background-color: white; /* White background */
		color: #003366; /* Dark blue text color */
		padding: 0.5rem; /* Add padding */
		border-radius: 10px; /* Rounded corners */
		font-family: "Andika", sans-serif;
		font-weight: 700;
		opacity: 1; /* Full opacity */
		border: 2px solid transparent; /* Initial border color */
	}

	.search-bar:focus {
		border-color: var(--button-bg-color); /* Dynamic border color */
		outline: none; /* Remove default outline */
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
		z-index: 0; /* Behind the cards */
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

	.tada {
		animation-name: tada;
		animation-delay: 0;
		animation-duration: 1s;
	}

	.ai-responses {
		position: absolute;
		top: 1rem;
		left: 1rem;
		width: 80%;
		max-width: 600px;
		background-color: rgba(255, 255, 255, 0.8);
		padding: 1rem;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
	.response {
		margin-bottom: 1rem;
		position: relative;
		background: #fff;
		border-radius: 10px;
		padding: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
	.response::after {
		content: "";
		position: absolute;
		bottom: -10px;
		left: 20px;
		width: 0;
		height: 0;
		border: 10px solid transparent;
		border-top-color: #fff;
		border-bottom: 0;
		margin-left: -10px;
		margin-bottom: -10px;
	}

	.firefly-confetti {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.firefly-confetti .firefly {
		position: absolute;
		width: 5px;
		height: 5px;
		background-color: rgba(255, 223, 0, 0.8); /* Warm yellow color */
		border-radius: 50%;
		animation:
			firefly-glow 3s infinite ease-in-out alternate,
			firefly-move 10s infinite ease-in-out alternate;
		box-shadow: 0 0 10px rgba(255, 223, 0, 0.8); /* Glow effect */
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

	.restart-button {
		position: absolute;
		bottom: 1rem;
		right: 3rem; /* Move button further to the left */
		padding: 0.5rem 1rem;
		font-size: 14px;
		font-family: "Andika", sans-serif;
		font-weight: 700;
		color: white;
		background-color: var(--button-bg-color); /* Dynamic background color */
		border: none;
		cursor: pointer;
		text-decoration: none;
		border-radius: 50px; /* Ellipse shape */
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px; /* Fixed width */
		height: 50px; /* Fixed height */
	}

	.loading-spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.6);
		border-radius: 50%;
		border-top-color: white;
		animation: spin 1s linear infinite;
		margin-left: 0.5rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.container {
			/* ...existing code... */
		}

		.card {
			/* ...existing code... */
		}

		.button-group {
			right: 1rem; /* Adjust for smaller screens */
		}

		.view-button {
			/* ...existing code... */
		}

		.search-bar {
			/* ...existing code... */
		}

		.restart-button {
			font-size: 12px;
			padding: 0.25rem 0.5rem;
			width: 40px; /* Adjusted width for smaller screens */
			height: 40px; /* Adjusted height for smaller screens */
			bottom: 1.5rem; /* Adjust for smaller screens */
			right: 2.5rem; /* Adjust for smaller screens */
		}
	}

	.action-button {
		padding: 0.5rem 1rem; /* Adjusted padding */
		font-size: 14px; /* Adjusted font size */
		font-family: "Andika", sans-serif;
		font-weight: 700;
		color: white;
		background-color: var(--button-bg-color); /* Dynamic background color */
		border: none;
		cursor: pointer;
		text-decoration: none;
		border-radius: 10px; /* More rounded corners */
		position: relative; /* For positioning the hover image */
		overflow: hidden; /* Hide the hover image initially */
		transition: box-shadow 0.3s ease; /* Transition for the glow effect */
		width: auto; /* Auto width */
		text-align: center; /* Center the text */
	}

	.action-button:hover {
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.8); /* White glow effect on hover */
	}

	.end-message-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.end-message {
		color: #003366; /* Dark blue text color */
		font-weight: bold; /* Bold text */
		background-color: rgba(255, 255, 255, 0.8); /* Light background */
		padding: 1rem; /* Add padding */
		border-radius: 10px; /* Rounded corners */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
		z-index: 1; /* Ensure it is above the fireflies */
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
		z-index: 0; /* Behind the message */
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
</style>
