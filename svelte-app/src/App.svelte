<script>
  import * as Earthstar from 'earthstar';

  import { fly } from 'svelte/transition';

  import authorKeypair from "./store/identity.js";
  import replica from "./store/replica.js";

  import Identity from "./lib/Identity.svelte";
  import Studio from "./lib/Studio.svelte";
  import UploadId from './lib/UploadId.svelte';
  import GridView from './lib/GridView.svelte';
  import GridUpload from './lib/GridUpload.svelte';

  let IDcreated = false;
  let showDetails = false;
  let imageView = true;
  let showWarning = false;

  // new peer & syncing with server
  const peer = new Earthstar.Peer();
  peer.addReplica($replica.replica);
  const sync = peer.sync("https://earthstar-server.fly.dev/sync", true);
  const syncAgain = peer.sync("https://languid-sand-parallelogram.glitch.me/", true);

  sync.onStatusChange((newStatus) => {
    console.log(newStatus);
  });
  syncAgain.onStatusChange((newStatus) => {
    console.log(newStatus);
  });

  sync.isDone().then(() => {
    console.log("Sync complete");
    }).catch((err) => {
    console.error("Sync failed", err);
});

  function handleUpload(event) {
    IDcreated = true;
    showDetails = true;
  }

  function handleError(event) {
    showWarning = true;
  }
  
    const urlParams = new URLSearchParams(window.location.search);
    const inStudio = urlParams.has('studio');

</script>

<main>
  <div>
    <!--<div class:showDetails>
      <h3>Current Share Details</h3>
      <p><b>Address:</b> {$shareKeypair.shareAddress} <b>Secret:</b> {$shareKeypair.secret}</p>
    </div>-->

    {#if !IDcreated}
    <div class='flex-row'>
      <button class='wrdfnt' on:click={() => (IDcreated = !IDcreated)}>
        Generate new Identity
      </button>
      <UploadId on:alias={handleUpload} on:error={handleError}/>
    </div>
      {#if showWarning === true}
      <blockquote transition:fly="{{ y: 200, duration: 2000 }}">
          Please upload a valid identity file
      </blockquote>
      {/if}
    {/if}
    {#if IDcreated && !showDetails}
      <button class="topright" on:click={() => (showDetails = !showDetails)}>
          Hide details
      </button>
    {:else if IDcreated && showDetails}
      <button class="topleft" on:click={() => (showDetails = !showDetails)}>
        {$authorKeypair.address.slice(0, 5)}
      </button>
      {#if !imageView}
      <div class='flex'>
        <GridUpload on:success={() => (imageView = !imageView)} on:upload={() => (imageView = !imageView)} {inStudio}/>


      </div>
      {:else if inStudio} 
      <Studio />
      {:else}
      <GridView />
      <!--<AllDocs />-->
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
  <div class:showDetails>
    {#if IDcreated}
      <Identity />
    {/if}
  </div>
</main>

<style>
  .wrdfnt {
    font-family: 'Fungal Grow 100 Thickness 500';
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
  .showDetails {
    display: none;
  }
  .topleft {
    position: fixed;
    top: 8px;
    left: 16px;
  }
  .topright {
    position: fixed;
    top: 8px;
    right: 16px;
  }
  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
