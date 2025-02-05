<script>
	import { Spring } from 'svelte/motion';

	let coords = new Spring({ x: 50, y: 50 }, {
		stiffness: 0.14,
		damping: 0.84
	});

	let size = new Spring(10);
</script>

<svg
	onmousemove={(e) => {
		coords.set({ x: e.clientX, y: e.clientY });
	}}
	onmousedown={() => (size.set(30))}
	onmouseup={() => (size.set(10))}
	role="presentation"
>

    <defs>
        <radialGradient id="lightGradient">
          <stop offset="0%" stop-color="rgba(255, 223, 0, 0.2)" />
          <stop offset="100%" stop-color="rgba(0, 0, 0, 0.5)" />
        </radialGradient>
      </defs>
    
      <!-- using my radial gradient -->
    <circle
        cx={$coords.x}
        cy={$coords.y}
        r={$size * 10}
        fill="url(#lightGradient)"
    />
</svg>

<style>
	svg {
        pointer-events: none;
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}

	circle {
		fill: url(#lightGradient);
	}
</style>
