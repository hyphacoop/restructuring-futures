<script>
  import * as Earthstar from "earthstar";

  import sharedSettings from "../store/settings";
  
  import { onMount } from "svelte";

  let value = "Add a new server URL";
  let showWarning = false;
  let errorMsg = undefined;

  const settings = new Earthstar.SharedSettings();

  function addServer(value) {
    let result = settings.addServer(value);
    if (Earthstar.isErr(result)) {
      showWarning = true;
      errorMsg = "Not a valid server URL";
      return;
    } else {
      showWarning = false;
      sharedSettings.set({
        settings,
      });
      console.log("You have", settings.servers.length, "servers");
      console.log("Your servers are", settings.servers);
    }
  }
</script>

<div>
  <input
    type="text"
    spellcheck="false"
    bind:value
  />

  <button on:click={() => addServer(value)}> Submit server </button>

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
    padding: 0.25rem;
    border-radius: 0.5rem;
    text-align: center;
  }
  button {
    width: 90%;
    margin: 0.25rem;
    padding: 0.25rem;
    border-radius: 0.5rem;
    align-items: flex-end;
    text-align: center;
  }
</style>
