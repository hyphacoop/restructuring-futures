<script>
  import { createEventDispatcher } from "svelte";
  import shareKeypair from "../../store/share";

  import pathToXY from "../utils/pathToXY";
  import splitTitleAndNotes from "../utils/splitTitleandNote";

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
  let hovered = false;
  let textContent, title, note;

  let XY = pathToXY(doc.path);
  let fileExtension = doc.path.split('.').pop();

  $: if (doc.text !== undefined) {
    textContent = splitTitleAndNotes(doc.text)
    title = textContent.title;
    note = textContent.note;
  }

  function handleMouseEnter() {
    if (!disabled) {
      hovered = true;
    }
  }

  function handleMouseLeave() {
    if (!disabled) {
      hovered = false;
    }
  }


  function getClick(doc) {
    console.log("clicked");
    dispatch("click", doc);
  }

  if (doc.path.endsWith(".md")) {
    currentIcon = images;
  } else {
    currentIcon = flowerImages;
  }

  let iconPhase =
    !$shareKeypair.shareAddress.includes("commons") ?
      1 :
    Math.floor(
      (deletionTime - Date.now()) / (2548800000000 / currentIcon.length)
    ) % currentIcon.length;

    //$: console.log("iconPhase", iconPhase, 'phase', phase, 'title', title);
</script>

{#if disabled}
  <div class="icon-container h-full no-event">
    <img
      src={currentIcon[iconPhase]}
      alt="document icon"
      class="blurred {replies ? 'small-icon' : ''} {'blurPhase' + iconPhase}"
    />
  </div>
{:else}
  <div
    class="icon-container {hovered && !replies ? 'hovered' : ''} {replies ? 'small-icon' : ''}"
    on:click={getClick}
    on:keypress={getClick}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
  >
    <img
      src={currentIcon[iconPhase]}
      alt="document icon, phase #{iconPhase}"
      class="{replies ? 'small-icon' : ''}"
    />
    {#if !replies}
      <div class="w-full details flex flex-row items-center justify-center">
        <p>{title}.{fileExtension}</p>
      </div>
      {#if hovered}
      <div class="coordinates">
        <p>{XY[0]}, {XY[1]}</p>
      </div>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    transition: transform 0.3s ease, background 0.3s ease, border-bottom 0.3s ease;
    cursor: pointer;
  }
  .icon-container img {
    max-width: 70px;
    max-height: 70px;
  }

  .icon-container.hovered {
    transform: scale(1.25);
    background: #FFF;
    border-bottom: 0.25rem solid #00495A;
  }


  .blurPhase0 {
    filter: blur(10px) saturate(20%);
  }
  .blurPhase1 {
    filter: blur(9px) saturate(30%);
  }
  .blurPhase2 {
  filter: blur(8px) saturate(40%);
  }
  .blurPhase3 {
    filter: blur(7px) saturate(50%);
  }
  .blurPhase4 {
    filter: blur(6px) saturate(60%);
  }
  .blurPhase5 {
    filter: blur(5px) saturate(70%);
  }
  .blurPhase6 {
    filter: blur(4px) saturate(80%);
  }
  .blurPhase7 {
    filter: blur(3px) saturate(90%);
  }
  .blurPhase8 {
    filter: blur(0px) saturate(100%);
  }


  .details {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 5px;
    border-radius: 3px;
    font-size: 0.8em;
  }

  .coordinates {
    position: absolute;
    bottom: 100%;
    left: 0;
    background: rgba(255, 255, 255, 0.7);
    padding: 5px;
    border-radius: 3px;
    font-size: 0.8em;
  }
  .no-event {
    pointer-events: none;
  }
  .small-icon {
    max-width: 40px !important;
    max-height: 40px !important;
  }

</style>