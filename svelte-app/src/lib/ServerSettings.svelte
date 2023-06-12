<script>
  import * as Earthstar from "earthstar";

  import sharedSettings from "../store/settings";
  import replicaDetails from "../store/replica";
  import { onMount } from "svelte";

  let value = "Add a new server URL";
  let showWarning = false;
  let errorMsg = undefined;

  let settings;
  let replica;

  // subscribe to sharedSettings store and keep local variable updated
  sharedSettings.subscribe(($settings) => {
    settings = $settings.settings;
  });

  // subscribe to replicaDetails store and keep local variable updated
  replicaDetails.subscribe(($replicaDetails) => {
    replica = $replicaDetails.replica;
  });

  
  async function addServer(value) {
    let result = settings.addServer(value);
    if (Earthstar.isErr(result)) {
      showWarning = true;
      errorMsg = "Not a valid server URL";
      return;
    } else {
      showWarning = false;
      serverAdded = true;
      sharedSettings.set({
        settings,
      });
      console.log("You have", settings.servers.length, "servers");
      console.log("Your servers are", settings.servers);

      // Sync with the newly added server
      const peer = new Earthstar.Peer();
      peer.addReplica(replica);
      const syncer = peer.sync(value);
      await syncer.isDone();
      syncComplete = true;
      console.log("Sync is done");
    }
  }
</script>

<div>
  <input
    type="text"
    spellcheck="false"
    bind:value
  />

  <button on:click={() => addServer(value)}> Add server </button>

    {#if serverAdded}
    <p>
      <strong> 
        Server was added successfully!
      </strong>
    </p>
  {/if}

  {#if syncComplete}
    <p>
      <strong> 
        Sync is complete!
      </strong>
    </p>
  {/if}

  {#if showWarning}
    <p>
      <strong> 
        {errorMsg} 
      </strong>
    </p>
  {/if}
</div>


<style>
  div {
    text-align: left;
    padding: 1rem;
    margin: 0.25rem;
  }
  input {
    width: 90%;
    height: 1.5rem;
    font-size: 1.3rem;
    resize: none;
    margin: 0.25rem;
    padding: 1rem 0.75rem;
    text-align: center;
  }
  button {
    width: 90%;
    margin: 0.25rem;
    padding: 0.25rem;
    align-items: flex-end;
    text-align: center;
  }
</style>
