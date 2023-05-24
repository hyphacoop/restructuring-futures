<script>
  import * as Earthstar from 'earthstar';

  import { fly } from 'svelte/transition';

  import authorKeypair from "./store/identity.js";
  import replica from "./store/replica.js";

  import Identity from "./lib/Identity.svelte";
  import Studio from "./lib/Studio.svelte";
  import Oracle from "./lib/Oracle.svelte";
  import UploadId from './lib/UploadId.svelte';
  import ValidateId from './lib/ValidateId.svelte';
  import GridView from './lib/GridView.svelte';
  import GridUpload from './lib/GridUpload.svelte';
  import StatusPanel from './lib/StatusPanel.svelte';
  import ShareSettings from './lib/ShareSettings.svelte';


  let IDcreated = false;
  let showDetails = false;
  let imageView = true;
  let showWarning = false;
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

    /*
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

  */

  function handleDetails() {
    showDetails = !showDetails;
    addShare = false;
    imageView = true;
  }

  function handleShare() {
    addShare = !addShare;
  }

  function handleView() {
    imageView = !imageView;
  }

$: console.log('IDcreated', IDcreated);

$: console.log('showDetails', showDetails);
$: console.log('imageView', imageView);
$: console.log('inStudio', inStudio);
$: console.log('oracle', oracle);

</script>

<main>
  <!-- Main APP -->
    
    <!-- Landing page prompts user to create or reuse ID -->
      {#if !IDcreated && !showDetails}
      <div class="my-12">
      <div class="flex flex-col lg:flex-row items-center mx-2 justify-between my-12">
      <div class='flex flex-col items-start mx-6 my-12'>

        <ValidateId on:validated={handleUpload} on:error={handleError} />

         <div class='mb-8'>
        <UploadId on:alias={handleUpload} on:error={handleError}/>
      </div>
      </div>
      
        
        <button class='phase1' on:click={() => (IDcreated = !IDcreated)}>
          Generate new Identity
        </button>
      </div>
    </div>
      {#if showWarning === true}
      <blockquote transition:fly="{{ y: 200, duration: 2000 }}">
          There was an error with your identity file
      </blockquote>
      {/if}
    {/if}

    <!-- If ID is created, show the main app -->
      {#if !imageView}
      <div>
        <GridUpload on:success={() => (imageView = !imageView)} on:upload={() => (imageView = !imageView)} {inStudio}/>


      </div>
      {:else if inStudio} 
      <Studio {inStudio} />
      {:else if oracle}
      <Oracle {inStudio}/>
      {:else}
      <div class="w-full">
        
        {#if IDcreated}
        <div class:showDetails class="py-12 px-2 flex flex-row justify-center">
          <Identity />
           <!-- Show StatusPanel only if there is a status (status !== undefined) -->
           {#if status !== undefined}
           <StatusPanel {status} />
          {/if}
        </div>
        {/if}

        <GridView {inStudio} {showDetails} {IDcreated} on:view={handleView} on:details={handleDetails} />
      
        </div>
   
      {/if}
<!-- Removing the show status panel to move it with identity 
      {#if status !== undefined}
      <button class="bottomleft" on:click={handlePanel}>
        {#if !showPanel}
          Show status panel
        {:else}
          Hide status panel
        {/if}
      </button>
      {/if}
-->
      
              <!-- This is currently in the way 
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
      -->


<!--
  {#if showPanel}
    <div>
     <StatusPanel {status} />
    </div>
  {/if}
-->


</main>

<style>
  button {
    width: auto;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
    min-width: 100vw;
  }
  .showDetails {
    display: none;
  }

</style>
