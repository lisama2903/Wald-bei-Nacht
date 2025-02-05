<script>
	import Router from "svelte-spa-router";
	import routes from "./routes";
	import { location } from "svelte-spa-router";
	// Überschriften
	import "@fontsource/bubblegum-sans";
	// Body
	import "@fontsource/andika/400.css";
	import "@fontsource/andika/700.css";
	import { overlay, openOverlay } from "./js/store-overlay.js";
	import InfoOverlay from "./components/InfoOverlay.svelte";
	import Cursor from "./components/Cursor.svelte";

	$: {
		console.log($overlay);
	}
</script>

<header>
	<nav>
		<ul>
			<li>
				<a href="#/">
					<img
						src="/images/hintergrund/images.png"
						alt="Logo"
						class="logo"
					/>
				</a>
			</li>
			<li>
				<a href="#/spieleanleitung">Spielanleitung</a>
			</li>
			<!-- <li>
				<button on:click={openOverlay}>Spielanleitung</button>
			</li> -->
		</ul>
	</nav>
</header>

<InfoOverlay />

<main style="width: 100%; margin: 0 auto;">
	<Router {routes} />
</main>

<footer>
	<p>&copy; Nachts im Wald.</p>
</footer>

<style>
	nav {
		position: absolute;
		z-index: 100000;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center; /* Center the navigation items */
		padding-right: 2rem; /* Adjust this value to move the links slightly to the left */
		background: rgba(0, 0, 0, 0.2); /* Even more transparent background */
		backdrop-filter: blur(10px); /* Glass effect */
		align-items: center; /* Center items vertically */
	}
	nav a {
		color: #ffffff;
		font-family: "Andika", sans-serif;
		font-size: 10pt; /* Smaller font size */
		font-style: normal;
		font-weight: 500; /* Medium font weight */
		line-height: normal;
		margin-left: 1rem;
		text-decoration: none; /* Remove underline */
	}
	nav a:hover {
		color: #ffcc00; /* Change color on hover */
	}
	nav .logo {
		width: 100px; /* Increased size */
		height: auto;
		margin-right: 1rem; /* Space between logo and navigation items */
	}
	footer {
		text-align: center;
		padding: 1rem;
		background-color: #181847; /* Updated background color */
	}
	footer p {
		margin: 0;
		color: white; /* White text color */
		font-family: "Andika", sans-serif;
		font-size: 14px;
	}
</style>
