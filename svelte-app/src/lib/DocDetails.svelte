<script>
  import { DocDriverIndexedDB } from "earthstar/browser";

  import { onMount } from "svelte";

  import splitTitleAndNotes from "./utils/splitTitleandNote";
  import pathToXY from "./utils/pathToXY";
  import { calculateSingleDocLunarPhase, calculateTimeToNextPhase } from "./utils/lunarPhase";

  import { PHASE_NAME, LUNAR_PHASE } from "./utils/constants";

  export let doc;
  export let attachment = true;
  export let isCommons = true;

  let showDetails = false;
  let title = undefined;
  let note = undefined;
  let sharedOn = undefined;
  let textContent;
  let content;
  let extended = false;
  let gridLocation;
  let phase;
  let timeToDeletion;
  let timeToNextPhase;
  let phaseLabel;

  onMount(() => {
    showDetails = true;
  });

  $: if (doc.text !== undefined) {

    textContent = splitTitleAndNotes(doc.text)
    title = textContent.title;
    console.log('title', title)
    note = textContent.notes;
    console.log('note', note)
    sharedOn = textContent.preface;
    gridLocation = pathToXY(doc.path);
    const result = calculateSingleDocLunarPhase(doc);
    phase = result.lunarPhase;
    timeToDeletion = result.timeToDeletion;
    timeToNextPhase = calculateTimeToNextPhase(phase, timeToDeletion);
  }

function formatDuration(microseconds) {
    const seconds = microseconds / 1000000;
    const days = Math.floor(seconds / (3600*24));
    const hours = Math.floor((seconds - days * 3600 * 24) / 3600);
    return { days, hours };
}

let duration;
$: {
    duration = formatDuration(timeToNextPhase);
    phaseLabel = phase === 3 ? 'deletion' : PHASE_NAME[phase + 1];
  }


</script>

<div class="my-4 text-left">
    <div>
      {#if attachment}
      <h6 class='mb-4'>Artefact metadata</h6>
      <div class='pt-2'><b>Title:</b>
      {title}
      </div>
      <div class=''><b>Location:</b>
        {gridLocation}
        </div>
        {#if isCommons}
        <div class=''><b>Phase:</b>
          {PHASE_NAME[phase]}
        </div>
        <div>
          <b>Time to {phaseLabel}:</b>
          
          {#if duration.days > 0}
            {duration.days} {duration.days > 1 ? 'days' : 'day'}
            {#if duration.hours > 0} and {/if}
          {/if}
        
          {#if duration.hours > 0}
            {duration.hours} {duration.hours > 1 ? 'hours' : 'hour'}
          {/if}
        </div>
        {/if}
        <div class=''><b>File type:</b>
          {doc.path.split(".")[doc.path.split(".").length - 1]}
        </div>
        <div class=''><b>File size:</b>
          {doc.attachmentSize / 1000} kb
        </div>
        <div class='break-words'>
          <b>Path:</b> {doc.path}
        </div>
       
        {#if note !== ""}
        <div class='py-2'>
          <b>Note:</b> {@html note}
        </div>
        {/if}
        <div class='py-2'>
          {@html sharedOn}
        </div>
      {/if}
    </div>
</div>
