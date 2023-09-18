<script>
  import { servers } from "../../store/settings";
  import Tooltip from "./Tooltip.svelte";

  export let truncate = false;

</script>

{#if $servers.length > 0}
  <div>
   {#key $servers.length}
    <div class='ml-0'>
      {#each $servers as server, i (i)}
        <div class='text-left'>
          {#if truncate}
          <Tooltip text={server}>
            <p class='truncate ... w-full'>{server}</p>
          </Tooltip>
        {:else}
          <p>{server}</p>
        {/if}
        </div>
      {/each}
      </div>
   {/key}
  </div>
{/if}

<style>

  
</style>