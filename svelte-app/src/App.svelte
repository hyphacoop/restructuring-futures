<script>
  import * as Earthstar from "./assets/scripts/earthstar";

  import shareKeypair from "./store/share.js";
  import replica from "./store/replica.js";

  import Identity from "./lib/Identity.svelte";
  import FileSharing from "./lib/FileSharing.svelte";
  import AllDocs from "./lib/AllDocs.svelte";

  let IDcreated = true;
  let showDetails = true;
  let imageView = true;

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
  

</script>

<main>
  <div>
    <div class:showDetails>
      <h3>Current Share Details</h3>
      <p><b>Address:</b> {$shareKeypair.shareAddress} <b>Secret:</b> {$shareKeypair.secret}</p>
    </div>

    {#if !IDcreated}
      <button on:click={() => (IDcreated = !IDcreated)}>
        Generate new Identity
      </button>
    {/if}
    {#if IDcreated && !showDetails}
      <button on:click={() => (showDetails = !showDetails)}>
        {#if showDetails}
          Show details
        {:else}
          Hide details
        {/if}
      </button>
    {:else if IDcreated && showDetails}
      <button class="topleft" on:click={() => (showDetails = !showDetails)}>
        Show details
      </button>
      {#if !imageView}
      <FileSharing on:success={() => (imageView = !imageView)} />
      {:else}
      <AllDocs />
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
  .showDetails {
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
