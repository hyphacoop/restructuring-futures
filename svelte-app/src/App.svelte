<script>
  import * as Earthstar from "./assets/scripts/earthstar";

  import shareKeypair from "./store/share.js";

  import Identity from "./lib/Identity.svelte";
  import FileSharing from "./lib/FileSharing.svelte";
  import DocContainer from "./lib/DocContainer.svelte";

  let shareDetails;

  shareKeypair.subscribe((response) => {
    shareDetails = response;
  });

  let IDcreated = false;
  let showHide = false;
  let topleft = false;
  let imageView = false;

</script>

<main>
  <div>
    <div class:showHide>
      <h3>Current Share Details</h3>
      <p><b>Address:</b> {shareDetails.shareAddress} <b>Secret:</b> {shareDetails.secret}</p>
    </div>

    {#if !IDcreated}
      <button on:click={() => (IDcreated = !IDcreated)}>
        Generate new Identity
      </button>
    {/if}
    {#if IDcreated && !showHide}
      <button on:click={() => (showHide = !showHide)}>
        {#if showHide}
          Show details
        {:else}
          Hide details
        {/if}
      </button>
    {:else if IDcreated && showHide}
      <button class="topleft" on:click={() => (showHide = !showHide)}>
        Show details
      </button>
      {#if !imageView}
      <FileSharing />
      {:else}
      <DocContainer />
      {/if}
      <button class="topright" on:click={() => (imageView = !imageView)}>
        {#if imageView}
          Upload file
        {:else}
          Show file
        {/if}
      </button>
    {/if}
  </div>
  <div class:showHide>
    {#if IDcreated}
      <Identity />
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1em;
    max-width: 600px;
    margin: 0 auto;
  }
  .showHide {
    display: none;
  }
  .topleft {
    position: absolute;
    top: 8px;
    left: 16px;
  }
  .topright {
    position: absolute;
    top: 8px;
    right: 16px;
  }
</style>
