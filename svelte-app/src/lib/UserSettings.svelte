<script>
  import Identity from "./Identity.svelte";
  import StatusPanel from "./StatusPanel.svelte";
  import ShareSettings from "./ShareSettings.svelte";
  import ServerSettings from "./ServerSettings.svelte";
  import InvitationUrl from "./InvitationUrl.svelte";

  import authorKeypair from "../store/identity";

  export let status;

  let activeComponent = "identity";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function toggleDetails() {
    dispatch("toggle");
  }
</script>

<div class="w-screen flex flex-row justify-end h-[10vh]">
  <button class="h-auto mr-6 phase2" on:click={toggleDetails}>
    {$authorKeypair.address.slice(0, 5)}
  </button>
</div>
<div class="flex min-h-screen overflow-y-auto">
  <div
    class="mx-1 mt-12 w-1/5 paper-yellow flex flex-col p-8 h-[80vh] sticky top-0"
  >
    <button class="my-1" on:click={toggleDetails}>Explore the commons</button>
    <button
      class:phase2={activeComponent === "identity"}
      class="my-1"
      on:click={() => (activeComponent = "identity")}>Show Identity Info</button
    >
    <button
      class:phase2={activeComponent === "status"}
      class="my-1"
      on:click={() => (activeComponent = "status")}>Show Status Panel</button
    >
    <button
      class:phase2={activeComponent === "share"}
      class="my-1"
      on:click={() => (activeComponent = "share")}>Show Share Settings</button
    >
    <button
      class:phase2={activeComponent === "server"}
      class="my-1"
      on:click={() => (activeComponent = "server")}>Show Server Settings</button
    >
    <button
      class:phase2={activeComponent === "invitation"}
      class="my-1"
      on:click={() => (activeComponent = "invitation")}
      >Show Invitation URL</button
    >
  </div>
  <div
    class="py-12 px-2 flex flex-col xl:flex-row justify-center w-4/5 items-start"
  >
    {#if activeComponent === "share"}
      <ShareSettings />
    {/if}
    {#if activeComponent === "identity"}
      <Identity />
    {/if}
    {#if activeComponent === "status"}
      <StatusPanel {status} />
    {/if}

    {#if activeComponent === "server"}
      <div>
        <ServerSettings />
      </div>
    {/if}

    {#if activeComponent === "invitation"}
      <div>
        <InvitationUrl />
      </div>
    {/if}
  </div>
</div>
