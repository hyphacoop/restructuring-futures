<script>
  import * as Earthstar from 'earthstar';

  import { fly } from 'svelte/transition';

  import authorKeypair from "./store/identity.js";
  import replica from "./store/replica.js";

  import Identity from "./lib/Identity.svelte";
  import Studio from "./lib/Studio.svelte";
  import Oracle from "./lib/Oracle.svelte";
  import UploadId from './lib/UploadId.svelte';
  import GridView from './lib/GridView.svelte';
  import GridUpload from './lib/GridUpload.svelte';
  import StatusPanel from './lib/StatusPanel.svelte';
  import ShareSettings from './lib/ShareSettings.svelte';


  let IDcreated = false;
  let showDetails = false;
  let imageView = true;
  let showWarning = false;
  let showPanel = false;
  let addShare = false;

  let status = undefined;


  // new peer & syncing with server
  const peer = new Earthstar.Peer();
  peer.addReplica($replica.replica);
  const sync = peer.sync("https://earthstar-server.fly.dev/sync", true);
  const syncAgain = peer.sync("https://languid-sand-parallelogram.glitch.me/", true);

  sync.onStatusChange((newStatus) => {
    status = newStatus;
    console.log(newStatus);
    status = status;
  });
  syncAgain.onStatusChange((newStatus) => {
    status = newStatus;
    console.log(newStatus);
    status = status;
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
    const oracle = urlParams.has('oracle');

  function handlePanel() {
    showPanel = !showPanel;
    addShare = false;
    showDetails = true;
    if (showPanel) {
      imageView = false;
    } else {
      imageView = true;
    }    
  }

  function handleDetails() {
    showDetails = !showDetails;
    showPanel = false;
    addShare = false;
    if (!showDetails) {
      imageView = false;
    } else {
      imageView = true;
    }
  }

  function handleShare() {
    addShare = !addShare;
  }

  function handleView() {
    imageView = !imageView;
    showPanel = false;
  }

$: console.log('IDcreated', IDcreated);
$: console.log('showPanel', showPanel);
$: console.log('showDetails', showDetails);
$: console.log('imageView', imageView);
$: console.log('inStudio', inStudio);
$: console.log('oracle', oracle);

</script>

<main>
  <div style="width: 100%;">

    <!-- Landing page prompts user to create or reuse ID -->
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

    <!-- Identity created, show details -->
    {#if IDcreated && !showDetails}
      <button class="topleft" on:click={handleDetails}>
          Hide identity details
      </button>
    {:else if IDcreated && showDetails}
      <button class="topleft" on:click={handleDetails}>
        {$authorKeypair.address.slice(0, 5)}
      </button>
      {#if !imageView && !showPanel}
      <div>
        <GridUpload on:success={() => (imageView = !imageView)} on:upload={() => (imageView = !imageView)} {inStudio}/>


      </div>
      {:else if inStudio} 
      <Studio {inStudio} />
      {:else if oracle}
      <Oracle {inStudio}/>
      {:else if !showPanel}
      <GridView {inStudio} />
      {/if}


      <button class="topright" on:click={handleView}>
        {#if imageView}
          Place an artefact
        {:else}
          Explore the commons
        {/if}
      </button>
      {#if status !== undefined}
      <button class="bottomleft" on:click={handlePanel}>
        {#if !showPanel}
          Show status panel
        {:else}
          Hide status panel
        {/if}
      </button>
      {/if}
      <div class="bottomright">
         {#if addShare}
        <div>
         <ShareSettings />
        </div>
        {/if}
      <button on:click={handleShare}>
               {#if !addShare}
          Add a share
        {:else}
          Hide share settings
        {/if}
      </button>
      </div>
    {/if}
  </div>


    {#if IDcreated}
    <div class:showDetails>
      <Identity />
    </div>
    {/if}


  {#if showPanel}
    <div>
     <StatusPanel {status} />
    </div>
  {/if}


</main>

<style>
  button {
    width: auto;
  }
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
  .bottomleft {
    position: fixed;
    bottom: 8px;
    left: 16px;
  }
  .bottomright {
    position: fixed;
    bottom: 8px;
    right: 16px;
  }
</style>
