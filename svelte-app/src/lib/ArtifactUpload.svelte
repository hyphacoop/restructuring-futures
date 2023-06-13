<script>
    import * as Earthstar from 'earthstar';
    import authorKeypair from "../store/identity";
    import replica from "../store/replica";

    import { createEventDispatcher } from 'svelte';

    export let filetype;
    export let xy = [0, 0];
    
    let inputArea;
    let artifactTitle;
    let artifactNotes;
    let textContent;
    let result; 

    const dispatch = createEventDispatcher();

    
    async function submitText() {
      let timestamp = Date.now();
      let deletionTime = (Date.now() + 2548800000) * 1000;
  
      // we convert text to Uint8Array, which is used in earthstar as an attachment
      let textAsBlob = new Blob([inputArea.value], { type: "text/markdown" });
      let arrayBuffer = await textAsBlob.arrayBuffer();
      let textUint8 = new Uint8Array(arrayBuffer);
        
        if (artifactNotes) {
            textContent = '#Title: ' + artifactTitle.value + '#Notes: ' + artifactNotes.value;
        } else {
            textContent = '#Title: ' + artifactTitle.value;
        }

      result = await $replica.replica.set($authorKeypair, {
        path: `/documents/${xy[0]}/${xy[1]}/${timestamp}/!text.md`,
        text:
          'Text input by ' +
          $authorKeypair.address.slice(1, 5) +
          " on " +
          new Date().toLocaleString() + textContent,
        attachment: textUint8,
        deleteAfter: deletionTime
      });
  
      console.log("Result: ", result);
      if (Earthstar.isErr(result)) {
        console.error(result);
      }
      dispatch('success');
      return result;
    }

</script>

<div class='p-6'>
    <div class="flex flex-row justify-start">
        <input
            id='titleInput'
            class="align-left"
            type="text"
            placeholder="Enter a title"
            bind:this={artifactTitle} />
        </div>
    <div class="flex flex-row justify-between">
        <textarea
            id='mainInput'
            placeholder="Enter text"
            bind:this={inputArea} ></textarea>
        <div class="pr-6">
            <h5 class='text-left'>Notes</h5>
            <input 
                type="text"
                placeholder="Enter optional notes"
                bind:this={artifactNotes} />
        </div>
    </div>
    <div class='flex flex-row justify-end my-6'>
        {#if filetype === 'text'}
            <button class="phase1" on:click={submitText}>
                Submit
            </button>
        {/if}
    </div>
</div>
<style>
    #titleInput {
        font-size: 1.5em;
        font-weight: bold;
        width: auto;
        margin-bottom: 2rem;
    }
    #mainInput {
        width: 60%;
        min-height:40vh;
        height: auto;
        font-size: 1;
        font-family: 'brandon-grotesque', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
</style>