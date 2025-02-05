import Home from "./routes/Home.svelte";
import Detektiv from "./routes/Detektiv.svelte";
import NotFound from "./routes/404.svelte";
import Spieleanleitung from "./routes/Spieleanleitung.svelte";

const routes = {
	"/": Home,
	"/spieleanleitung": Spieleanleitung,
	"/detektiv": Detektiv,
	"*": NotFound,
};

export default routes;
