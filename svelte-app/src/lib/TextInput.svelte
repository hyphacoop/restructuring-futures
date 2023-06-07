<script>
    import * as Earthstar from 'earthstar';
     import { fly } from 'svelte/transition';
    import authorKeypair from "../store/identity";
    import replica from "../store/replica";
  
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    let src = 'images/text-icon.png' 
  
    let isModalOpen = false;
    let inputArea;
    let result;

    export let xy = [0, 0];
  
    async function submitText() {
      let timestamp = Date.now();
      let deletionTime = (Date.now() + 2548800000) * 1000;
  
      // we convert text to Uint8Array, which is used in earthstar as an attachment
      let textAsBlob = new Blob([inputArea.value], { type: "text/markdown" });
      let arrayBuffer = await textAsBlob.arrayBuffer();
      let textUint8 = new Uint8Array(arrayBuffer);
  
      result = await $replica.replica.set($authorKeypair, {
        path: `/documents/${xy[1]}/${xy[0]}/${timestamp}/!text.md`,
        text:
          'Text input by ' +
          $authorKeypair.address.slice(1, 5) +
          " on " +
          new Date().toLocaleString(),
        attachment: textUint8,
        deleteAfter: deletionTime
      });
  
      console.log("Result: ", result);
      if (Earthstar.isErr(result)) {
        console.error(result);
      }
      dispatch('success');
      isModalOpen = false;
      return result;
    }
  
    $: result = result;
  
  </script>
  <div>
    <div>

        <button class="phase1"
        on:click={() => isModalOpen = !isModalOpen}
        on:keypress={() => isModalOpen = !isModalOpen}
        >
        written text
      </button>
    </div>
  
    {#if isModalOpen}
    <div transition:fly="{{ y: 200, duration: 200 }}" class="modal">
      <textarea
        bind:this={inputArea}
      />
      <div class="button-container">
        <button
          on:click={() => submitText()}
          on:keypress={() => submitText()}
        >
          Submit
        </button>
        <button
          on:click={() => isModalOpen = false}
          on:keypress={() => isModalOpen = false}
        >
          Close
        </button>
      </div>
    </div>
    {/if}
  
    {#if result}
    <p>
      <strong>
        {result.kind}
      </strong>
    </p>
    {/if}
  </div>
  
  <style>
    div {
      margin:0.5rem;
    }
    .input {
      height: 50px;
      width: 50px;
      cursor: pointer;
    }
    .inputText {
      cursor: pointer;
    }	
    .modal {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 1em;
    border-radius: 8px;
    z-index: 999;
  }
  .button-container {
    display: flex;
    gap: 1em;
  }
  </style>