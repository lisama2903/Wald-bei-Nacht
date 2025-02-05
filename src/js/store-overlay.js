import {writable} from 'svelte/store';

export function closeOverlay() {
    overlay.set(false);
}
export function openOverlay() {
    overlay.set(true);
}

export const overlay = writable(false);
