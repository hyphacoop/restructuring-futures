<script>
    import Identity from "./Identity.svelte";
    import StatusPanel from "./StatusPanel.svelte";
    import ShareSettings from "./ShareSettings.svelte";
    import ServerSettings from "./ServerSettings.svelte";
  
    export let status;

    import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  function toggleDetails() {
    dispatch('toggle');
  }
  </script>
  <div class="w-screen flex flex-row justify-end">
      <button class="h-auto m-6" on:click={toggleDetails}>

        Hide Details
  
    </button>
</div>
  <div class="flex min-h-screen overflow-y-auto">
    <div class="mx-1 mt-12 w-1/5 paper-yellow flex flex-col p-8 h-[80vh] sticky top-0">
        <div>
            <ServerSettings />
        </div>
        <div>
            <ShareSettings />
           </div>
    </div>
  <div class="py-12 px-2 flex flex-row justify-center w-4/5 items-start">
    <Identity />
    
    <!-- Show StatusPanel only if there is a status (status !== undefined) -->
    {#if status !== undefined}
      <StatusPanel {status} />
    {/if}

  </div>

</div>