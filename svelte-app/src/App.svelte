<script>
  import * as Earthstar from 'earthstar';

  import { fly } from 'svelte/transition';

  import authorKeypair from "./store/identity.js";
  import replica from "./store/replica.js";
  import settings from './store/settings.js';

  import { onMount } from "svelte";

  import Identity from "./lib/Identity.svelte";
  import Studio from "./lib/Studio.svelte";
  import Oracle from "./lib/Oracle.svelte";
  import UploadId from './lib/UploadId.svelte';
  import ValidateId from './lib/ValidateId.svelte';
  import GridView from './lib/GridView.svelte';
  import GridUpload from './lib/GridUpload.svelte';
  import StatusPanel from './lib/StatusPanel.svelte';
  import ShareSettings from './lib/ShareSettings.svelte';
  import UserSettings from './lib/UserSettings.svelte';


  let IDcreated = false;
  let showDetails = false;
  let imageView = true;
  let showWarning = false;
  let showUserSettings = false;

  let status = undefined;


  onMount(async () => {
    if (settings.author) {
        // if an author already exists, use it
        authorKeypair.set(settings.author);
        IDcreated = true;
    } else {
        // if no author exists, generate a new one
        IDcreated = false;
    }
});

  // new peer & syncing with server
  const peer = new Earthstar.Peer();
  peer.addReplica($replica.replica);
  const sync = peer.sync(import.meta.env.VITE_SERVER_ADDRESS, true);
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

  function handleDetails() {
    showDetails = !showDetails;
    imageView = true;
  }

  function handleView() {
    imageView = !imageView;
  }

  function toggleUserSettings() {
  showUserSettings = !showUserSettings;
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

        <ValidateId on:validated={handleUpload} on:error={handleError} on:generateNewIdentity={() => (IDcreated = !IDcreated)} />

         <div class='mb-8'>
        <UploadId on:alias={handleUpload} on:error={handleError}/>
      </div>
      </div>
      
      </div>
    </div>
      {#if showWarning === true}
      <blockquote transition:fly="{{ y: 200, duration: 2000 }}">
          There was an error with your identity file
      </blockquote>
      {/if}
    {/if}

    <!-- If ID is created, show the main app -->


        {#if IDcreated && !showUserSettings}
          <div class="w-full">
          <GridView on:toggle={toggleUserSettings} {inStudio} {showDetails} {IDcreated} on:view={handleView} on:details={() => showUserSettings = true} />
          </div>
            {:else}
            <div class="w-full">
          <UserSettings {status} on:toggle={toggleUserSettings}/>
        </div>
        {/if}

       
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
    min-width: 100vw;
  }
</style>
