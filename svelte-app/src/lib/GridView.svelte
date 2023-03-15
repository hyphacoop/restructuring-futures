<script>
  import FileSharing from "./FileSharing.svelte";
  import { onMount } from "svelte";

  import cache from "../store/cache";
  import { time } from "../store/time";

  import SingleDoc from "./SingleDoc.svelte";

  let grid = [4, 8];

  $: col = `repeat(${grid[1]}, 1fr)`;
  $: row = `repeat(${grid[0]}, 1fr)`;

  let documents = [];
  let oracle = true;
  let hours = [ 10800000000, 7200000000, 3600000000, 0];
  let lunarphase = [ 1918080000000, 1278720000000, 639360000000, 0];
  let usTime = $time.getTime() * 1000;
  let colorCycle = [ "#b5d1c0", "#d3e3d9", "#f9dfdd", "#fff5d9"]

  export let inStudio;

  // fetch documents 
  const fetchDocs = async () => {
    documents = $cache.cache.queryDocs({
      filter: {
        pathStartsWith: "/documents",
      },
    });
    documents = documents.filter((doc) => doc.path.split("/").length <= 6);
    console.log("Docs", documents);
  };

  $cache.cache.onCacheUpdated(() => {
    fetchDocs();
  });

  onMount(() => {
    fetchDocs();
  });

  function updateUI() {
    setTimeout(() => {
      fetchDocs();
    }, 1000);
  }

  $: documents = documents;
</script>

<div>
    <h2>The Commons</h2>
    <FileSharing {oracle} {inStudio}/>
    <div class='flex'>
        {#if documents.length === 0}
            <p>No files yet</p>
        {:else}
          {#each hours as hour, k (k)}
          <div
          class="container"
          style="grid-template-rows: {row}; grid-template-columns: {col}; background-color: {colorCycle[k]};"
          >         
          {#each documents as doc (doc.textHash+doc.timestamp)}
            {#each { length: grid[0] } as _, i (i)}
              {#each { length: grid[1] } as _, j (j)}
                {#if doc.path.split('/')[2] == j && doc.path.split('/')[3] == i}  

                      <div id={doc.textHash+doc.timestamp}>
                          {#if hour == hours[0]}

                            {#if usTime < (doc.deleteAfter - hour) == false}
                            <SingleDoc {doc} on:update={updateUI} {inStudio} disabled={true} />
                            {:else}
                              <SingleDoc {doc} on:update={updateUI} {inStudio} />
                            {/if}
                          {:else}
                            {#if (usTime < (doc.deleteAfter - hour) && (usTime > (doc.deleteAfter - (hour + 3600000000)))) == false}
                              <SingleDoc {doc} on:update={updateUI} {inStudio} disabled={true} />
                            {:else}
                              <SingleDoc {doc} on:update={updateUI} {inStudio} />
                            {/if}
                          {/if}
                      </div>
                    {/if}
                {/each}
              {/each}
            {/each}
          </div>
          {/each}
        {/if}
      </div>
  </div>

<!-- Displays coordinates of selected area 
    <strong>Coords:</strong> {start} {end[0] ? '-' : ''} {end} -->
<style>
      h2 {
        text-align: center;
        font-family: "Fungal Grow 400 Thickness 1000";
    }
  .container {
    display: grid;
    border-radius: 2px;
    width: 100%;
    min-height: 100vh;
    grid-gap: 0px;
  }

  .container div {
    height:min-content;
    width: min-content;
  }
</style>
