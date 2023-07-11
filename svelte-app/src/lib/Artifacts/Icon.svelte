<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let images = [
    "icons/mountain-phase-0-02.png",
    "icons/mountain-phase-1-02.png",
    "icons/mountain-phase-2-02.png",
    "icons/mountain-phase-3-02.png",
    "icons/mountain-phase-4-02.png",
    "icons/mountain-phase-5-02.png",
    "icons/mountain-phase-6-02.png",
    "icons/mountain-phase-7-02.png",
    "icons/mountain-phase-8-02.png",
  ];

  let flowerImages = [
    "icons/flower-phase-0-02.png",
    "icons/flower-phase-1-02.png",
    "icons/flower-phase-2-02.png",
    "icons/flower-phase-3-02.png",
    "icons/flower-phase-4-02.png",
    "icons/flower-phase-5-02.png",
    "icons/flower-phase-6-02.png",
    "icons/flower-phase-7-02.png",
    "icons/flower-phase-8-02.png",
  ];

  export let doc;
  export let disabled = false;
  export let phase;
  export let replies = false;

  let currentIcon;
  let deletionTime = doc.deleteAfter;

  function getClick(doc) {
    console.log("clicked");
    dispatch("click", doc);
  }

  if (doc.path.endsWith(".md")) {
    currentIcon = images;
  } else {
    currentIcon = flowerImages;
  }

  let newPhase =
    Math.floor(
      (deletionTime - Date.now()) / (2548800000000 / currentIcon.length)
    ) % currentIcon.length;
</script>

{#if disabled}
  <div>
    <img
      src={currentIcon[newPhase]}
      alt="document icon"
      style="filter: blur(1px);"
    />
  </div>
{:else}
  <div on:click={getClick} on:keypress={getClick}>
    <img
      src={currentIcon[newPhase]}
      alt="document icon, phase #{phase}"
      class={replies ? "small-icon" : ""}
    />
  </div>
{/if}

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  img {
    max-width: 100px;
    max-height: 100px;
  }

  .small-icon {
    max-width: 40px;
    max-height: 40px;
  }
</style>
