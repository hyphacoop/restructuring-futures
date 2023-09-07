<script>
 import { servers } from "../../store/settings";

 // $: console.log('servers', servers);
</script>

{#if $servers.length > 0}
  <div>
   {#key $servers.length}
    <ul class='ml-0'>
      {#each $servers as server, i (i)}
        <li>{server}</li>
      {/each}
    </ul>
   {/key}
  </div>
{/if}

<style>
  ul {
    list-style-type: inherit;
    padding-left:1.1rem;
  }
  
</style>