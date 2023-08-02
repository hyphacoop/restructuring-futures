<script>
      import * as Earthstar from "earthstar";

import settings from "../../store/settings";
import replicaDetails from "../../store/replica";


let value;
  let selectedServer;
  let serverRemoved = false;
  let showWarning = false;
  let errorMsg = undefined;
  let serverAdded = false;
  let syncComplete = false;

  let replica;

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

<div class="w-full flex flex-col lg:flex-row my-2">
    <input
      type="text"
      spellcheck="false"
      bind:value
      placeholder="Add a new server URL"
    />
  
    <button class='mx-4 phase1'on:click={() => addServer(value)}> Add server </button>
  
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