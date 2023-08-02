<script>
  import settings from "../../store/settings";
</script>

{#if settings.servers.length > 0}
  <div>
   
    <ul class='ml-0'>
      {#each settings.servers as server, i (i)}
        <li>{server}</li>
      {/each}
    </ul>
  </div>
{/if}
<style>
  ul {
    list-style-type: inherit;
  }
</style>