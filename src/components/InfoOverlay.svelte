<script>
  import { closeOverlay, overlay } from "../js/store-overlay";
	import { fly } from "svelte/transition";
</script>

{#if $overlay}
  <div class="info-overlay" on:click={closeOverlay}>
    <div
      transition:fly={{ y: 20, duration: 300 }}
      class="info-box"
      on:click|stopPropagation
    >
      <button class="close-button" on:click={closeOverlay}>×</button>
      <h2>Spielanleitung</h2>
      <p>
        Bist du bereit für ein spannendes Abenteuer in der Dämmerung? Im Wald
        wachen die Tiere langsam auf – und du kannst herausfinden, welches Tier
        sich hinter den Hinweisen verbirgt!
      </p>
      <h3>So spielst du:</h3>
      <ul>
        <li>Du bekommst ein geheimes Waldtier zugewiesen.</li>
        <li>Auf dem Bildschirm erscheinen viele Karten mit Tierteilen.</li>
        <li>
          Lies die Aussagen über dein Tier aufmerksam durch – sie helfen dir,
          falsche Tierteile auszusortieren.
        </li>
        <li>
          Klicke auf die Tierteile, die nicht zu deinem Tier passen, und sie
          verschwinden.
        </li>
      </ul>
      <h3>Dein Ziel:</h3>
      <p>
        Sortiere alle falschen Tierteile aus, bis nur noch dein Tier übrig
        bleibt. Hast du das richtige Tier gefunden? Dann wird es vollständig
        sichtbar – und erwacht mit einem Lächeln! 🐾✨
      </p>
      <p>
        Tauche ein in die magische Welt der dämmernden Wälder und finde heraus,
        welches Tier in dir steckt! Viel Spaß beim Spielen! 🌙🦊
      </p>
    </div>
  </div>
{/if}

<style>
  .info-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
  }
  .info-box {
    background-color: #000a1f; /* Even darker blue color */
    color: white; /* White text */
    padding: 2rem;
    border-radius: 10px;
    position: relative;
    max-width: 600px;
    text-align: left;
  }
  .info-box h2 {
    margin-bottom: 1rem;
  }
  .info-box p {
    margin-bottom: 1rem;
  }
  .info-box ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: white; /* White color for the close button */
  }
</style>
