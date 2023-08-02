<script>
          import * as Earthstar from "earthstar";

import settings from "../../store/settings";



let value;
  let selectedServer;
  let serverRemoved = false;
  let showWarning = false;
  let errorMsg = undefined;
  let serverAdded = false;
  let syncComplete = false;

  function removeServer() {
    let result = settings.removeServer(selectedServer);
    if (Earthstar.isErr(result)) {
      showWarning = true;
      errorMsg = "Failed to remove server";
    } else {
      showWarning = false;
      serverRemoved = true;
      console.log("You have", settings.servers.length, "servers");
      console.log("Your servers are", settings.servers);
    }
  }
</script>


<div class="flex flex-col lg:flex-row my-2">
    <select bind:value={selectedServer}>
      <option value="">Select a server to remove</option>
      {#each settings.servers as server (server)}
        <option value={server}>{server}</option>
      {/each}
    </select>
  
    <button class='mx-4 phase1' on:click={removeServer}>Remove server</button>
  
    {#if serverRemoved}
      <p>
        <strong> 
          Server was removed successfully!
        </strong>
      </p>
    {/if}
  </div>