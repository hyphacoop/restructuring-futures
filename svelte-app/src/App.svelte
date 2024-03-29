<script>
  import * as Earthstar from "earthstar";

  import { fly } from "svelte/transition";

  import authorKeypair from "./store/identity.js";
  import replicaDetails from "./store/replica.js";
  import settings from "./store/settings.js";
  import shareKeypair from "./store/share.js";
  import { statusStore } from './store/status.js';


  import { onMount } from "svelte";

  import Identity from "./lib/Customization/Identity.svelte";
  import UploadId from "./lib/UploadId.svelte";
  import ValidateId from "./lib/ValidateId.svelte";
  import GridView from "./lib/GridView.svelte";
  import GridUpload from "./lib/GridUpload.svelte";
  import StatusPanel from "./lib/Components/StatusPanel.svelte";
  import ShareSettings from "./lib/ShareSettings.svelte";
  import UserSettings from "./lib/UserSettings.svelte";
  import MouseBanner from "./lib/MouseBanner.svelte";
  import Footer from "./lib/Components/Footer.svelte";
  import Tooltip from "./lib/Components/Tooltip.svelte";


  const studioShareAddress = import.meta.env.VITE_STUDIO_SHARE_ADDRESS;
  const studioSecret = import.meta.env.VITE_STUDIO_SECRET;


  let IDcreated = false;
  let showDetails = false;
  let imageView = true;
  let showWarning = false;
  let showUserSettings = false;
  let initialView = 'workspace';

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
      // Add a share and check the result
      const studioResult = settings.addShare(studioShareAddress);
    
    if (Array.isArray(studioResult)) {
      // If the result is an array, the share was added successfully
      settings.addSecret(studioShareAddress, studioSecret);
    } else if (studioResult instanceof Earthstar.ValidationError) {
      // Handle the validation error
      console.error("Failed to add share due to validation error:", studioResult.message);
    }

    const shareResult = settings.addShare($shareKeypair.shareAddress);
    if (Array.isArray(shareResult)) {
      settings.addSecret($shareKeypair.shareAddress, $shareKeypair.shareSecret);
    } else if (shareResult instanceof Earthstar.ValidationError) {
      console.error("Failed to add share due to validation error:", shareResult.message);
    }
    createNewPeer();
  });

  function createNewPeer() {

  const peer = new Earthstar.Peer();
  peer.addReplica($replicaDetails.replica);
  const sync = peer.sync(import.meta.env.VITE_SERVER_ADDRESS, true);
  const server = settings.addServer(import.meta.env.VITE_SERVER_ADDRESS);

  
  sync.onStatusChange((newStatus) => {
    status = newStatus;
    //console.log(newStatus);
    statusStore.set(status);
    //console.log('status', status)
  });

  sync
    .isDone()
    .then(() => {
      console.log("Sync complete");
    })
    .catch((err) => {
      console.error("Sync failed", err);
    });
  
  }

  // new peer & syncing with server
  $: if ($replicaDetails) {
    createNewPeer();
  }
 

  function handleUpload(event) {
    IDcreated = true;
    showDetails = true;
  }

  function generateID() {
    IDcreated = true;
    showDetails = false;
    showUserSettings = true;
    initialView = 'identity';
  }

  function exploreCommons() {
    IDcreated = true;
    showDetails = false;
    showUserSettings = false;
  }

  function handleError(event) {
    showWarning = true;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const inStudio = urlParams.has("studio");
  const oracle = urlParams.has("oracle");

  function handleView() {
    imageView = !imageView;
  }

  function toggleUserSettings() {
    showUserSettings = !showUserSettings;
  }


  // inform users that this app is not optimized on mobile
  let windowWidth;
  let isMobile = false;

  $: windowWidth = window.innerWidth;

$: {
  if (windowWidth <= 768) {
    isMobile = true;
      } else {
    isMobile = false;
   
  }
}

</script>

<main>
  <!-- Main APP -->

  <!-- Landing page prompts user to create or reuse ID -->
  {#if !IDcreated && !showDetails}
    <div class="my-12">
      <h1>Eccentric Networks</h1>
      <h4>Collaboration space for the unconnected</h4>
      {#if isMobile}
      <h5 class='mt-6 w-1/2 mx-auto'>
        This app has not been optimized for smaller screens. Please use this app on desktop.
      </h5>
      {:else}
      <div
        class="flex flex-col lg:flex-row items-center mx-16 justify-evenly my-12"
      >
        <button class="phase1 mx-16 mt-12 text-2xl" on:click={generateID}
          >Generate new Identity</button
        >
        <Tooltip text='You will need an identity in order to interact with the artefacts'>
        <button
          class="phase1 mx-16 mt-12 text-2xl"
          on:click={exploreCommons}
          >Explore the commons</button
        >
      </Tooltip>
      </div>
      <div
        class="w-1/2 flex flex-col lg:flex-row items-center mx-2 justify-center my-12"
      >
        <div class="flex flex-row items-center mx-6 my-12">
          <ValidateId
            on:validated={handleUpload}
            on:error={handleError}
            on:generateNewIdentity={() => (IDcreated = !IDcreated)}
            on:alias={handleUpload}
          />
        </div>
      </div>
      <MouseBanner />
      {/if}
    </div>
    {#if showWarning === true}
      <blockquote transition:fly={{ y: 200, duration: 2000 }}>
        There was an error with your identity file
      </blockquote>
    {/if}
  {/if}

  <!-- If ID is created, show the main app -->

  {#if IDcreated && !showUserSettings}
    <div class="w-full">
      <GridView
        on:toggle={toggleUserSettings}
        {showDetails}
        on:view={handleView}
        on:details={() => (showUserSettings = true)}
      />
    </div>
  {:else if IDcreated && showUserSettings}
    <div class="w-full">
      <UserSettings on:toggle={toggleUserSettings} {initialView} on:shareUpdated={toggleUserSettings}/>
    </div>
  {/if}
</main>
<Footer />

<style>
  h1 {
    font-size: var(--font-size-xxl);
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
</style>
