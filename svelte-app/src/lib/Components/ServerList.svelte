<script>
 import { servers } from "../../store/settings";
  import Tooltip from "./Tooltip.svelte";

</script>

{#if $servers.length > 0}
  <div>
   {#key $servers.length}
    <ul class='ml-0'>
      {#each $servers as server, i (i)}
        <li>
          <Tooltip text={server}>
            <p class='w-full truncate ...' style="max-width: 150px;">{server}</p>
          </Tooltip>
          </li>
      {/each}
    </ul>
   {/key}
  </div>
{/if}

<style>
  ul {
    list-style-type: none;
    padding-left:-1.1rem;
  }
  
</style>