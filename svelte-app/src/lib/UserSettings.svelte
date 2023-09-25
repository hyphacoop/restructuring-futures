<script>
  import Identity from "./Customization/Identity.svelte";
  import Server from "./Customization/Server.svelte";
  import Workspace from "./Customization/Workspace.svelte";

  import authorKeypair from "../store/identity";


  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let initialView = "workspace";
    
  let activeComponent = initialView;

  function toggleDetails() {
    dispatch("toggle");
  }
</script>

<div class="the-scroll flex flex-col sm:flex-row min-h-screen overflow-y-auto">
  <div class="sm:w-1/5 flex flex-col fixed">
    <button
      class="ml-6 mt-4 mb-2 h-auto mr-1 border-black"
      on:click={toggleDetails}
    >
      🔮 exit app customization
    </button>
    <p class="ml-6 text-2xl text-left">
      <b> current alias: </b>{$authorKeypair.address.slice(0, 5)}
    </p>
    <div
      class="paper-yellow customBorder ml-6 mx-1 sm:mt-4 flex flex-row sm:flex-col p-8 h-auto sm:h-[80vh] z-50 customBorder"
    >
      <button
        class:phase2={activeComponent === "workspace"}
        class="my-1"
        on:click={() => (activeComponent = "workspace")}
        >workspace settings</button
      >
      <button
        class:phase2={activeComponent === "server"}
        class="my-1"
        on:click={() => (activeComponent = "server")}>server settings</button
      >
      <button
        class:phase2={activeComponent === "identity"}
        class="my-1"
        on:click={() => (activeComponent = "identity")}>manage alias</button
      >
    </div>
  </div>
  <div class="w-full sm:w-[80vw] mt-16 sm:mt-10 sm:ml-[25vw]">
    {#if activeComponent === "workspace"}
      <Workspace on:shareUpdated />
    {/if}

    {#if activeComponent === "server"}
      <div>
        <Server />
      </div>
    {/if}
    {#if activeComponent === "identity"}
      <Identity />
    {/if}
  </div>
</div>
<style>
   .customBorder {
    border: 1px solid #71302B; 
  }
</style>
