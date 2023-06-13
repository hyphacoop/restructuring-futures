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

<div>
    <h3>
        <input
            type="text"
            placeholder="Enter a title"
            bind:this={artifactTitle} />
    </h3>
    <div class="flex flex-row">
        <input
            type="text"
            placeholder="Enter text"
            bind:this={inputArea} />
        <div>
            <h4>Notes</h4>
            <input 
                type="text"
                placeholder="Enter optional notes"
                bind:this={artifactNotes} />
        </div>
    </div>
    <div>
        {#if filetype === 'text'}
            <button class="phase1" on:click={submitText}>
                Submit
            </button>
        {/if}
    </div>
</div>