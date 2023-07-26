<script>
  import * as Earthstar from "earthstar";

  import { fly } from "svelte/transition";

  import authorKeypair from "./store/identity.js";
  import replicaDetails from "./store/replica.js";
  import settings from "./store/settings.js";

  import { onMount } from "svelte";

  import Identity from "./lib/Identity.svelte";
  import UploadId from "./lib/UploadId.svelte";
  import ValidateId from "./lib/ValidateId.svelte";
  import GridView from "./lib/GridView.svelte";
  import GridUpload from "./lib/GridUpload.svelte";
  import StatusPanel from "./lib/StatusPanel.svelte";
  import ShareSettings from "./lib/ShareSettings.svelte";
  import UserSettings from "./lib/UserSettings.svelte";
  import MouseBanner from "./lib/MouseBanner.svelte";

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
    settings.addShare('+studio.bywytquv2ypa7qqwtj3gbuel5fnqh6w5n5yecdqbwzsr4keativ3a');
    settings.addSecret('+studio.bywytquv2ypa7qqwtj3gbuel5fnqh6w5n5yecdqbwzsr4keativ3a', 'bexvgelmf632ecsgvqhhbwgqgmny5vren673canlay2istswfzspq');
  });

  // new peer & syncing with server
  const peer = new Earthstar.Peer();
  peer.addReplica($replicaDetails.replica);
  const sync = peer.sync(import.meta.env.VITE_SERVER_ADDRESS, true);
  const server = settings.addServer(import.meta.env.VITE_SERVER_ADDRESS);
  console.log(server);

  sync.onStatusChange((newStatus) => {
    status = newStatus;
    console.log(newStatus);
    status = status;
  });

  sync
    .isDone()
    .then(() => {
      console.log("Sync complete");
    })
    .catch((err) => {
      console.error("Sync failed", err);
    });

  function handleUpload(event) {
    IDcreated = true;
    showDetails = true;
  }

  function generateID() {
    IDcreated = true;
    showUserSettings = true;
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

  $: {
    console.log("IDcreated", IDcreated);
    console.log("showDetails", showDetails);
    console.log("imageView", imageView);
  }
</script>

<main>
  <!-- Main APP -->

  <!-- Landing page prompts user to create or reuse ID -->
  {#if !IDcreated && !showDetails}
    <div class="my-12">
      <h1>Eccentric Networks</h1>
      <h4>Collaboration space for the unconnected</h4>
      <div
        class="flex flex-col lg:flex-row items-center mx-16 justify-evenly my-12"
      >
        <button class="phase1 mx-16 mt-12 text-2xl" on:click={generateID}
          >Generate new Identity</button
        >
        <button
          class="phase1 mx-16 mt-12 text-2xl"
          on:click={() => (IDcreated = !IDcreated && showDetails === false)}
          >Explore the commons</button
        >
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
        {IDcreated}
        on:view={handleView}
        on:details={() => (showUserSettings = true)}
      />
    </div>
  {:else if IDcreated && showUserSettings}
    <div class="w-full">
      <UserSettings {status} on:toggle={toggleUserSettings} />
    </div>
  {/if}
</main>

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
