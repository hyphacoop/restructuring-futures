<script>
  import FileSharing from "./FileSharing.svelte";
  import { onMount } from "svelte";

  import cache from "../store/cache";
  import { time } from "../store/time";

  import SingleDoc from "./SingleDoc.svelte";

  let grid = [4, 8];

  $: col = `repeat(${grid[1]}, 1fr)`;
  $: row = `repeat(${grid[0]}, minmax(25%, auto))`;

  let documents = [];
  let oracle = true;
  let hours = [ 10800000000, 7200000000, 3600000000, 0];
  let convertedTime = $time.getTime() * 1000;


  export let inStudio;

  // fetch documents from the cache
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
          {#each hours as hour (hour)}
          <div
          class="container"
          style="grid-template-rows: {row}; grid-template-columns: {col};"
        >
            {#each { length: grid[0] } as _, i (i)}
              {#each { length: grid[1] } as _, j (j)}
                  
                {#each documents as doc (doc.textHash)}

                    {#if doc.path.split('/')[2] == j && doc.path.split('/')[3] == i}           

                    <div id={doc.textHash}>

                        {#if (convertedTime > (doc.deleteAfter - hour)) && (convertedTime > (doc.deleteAfter - (hour - 3600000000)))}
                        <SingleDoc {doc} on:update={updateUI} {inStudio} disabled={true} />
                        {:else}
                        <SingleDoc {doc} on:update={updateUI} {inStudio} />
                        {/if}

                      </div>
                    {:else}
                    <div></div>
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
    height: 90%;
    grid-gap: 0px;
  }

  .container div {
    background: #fff;
    height:min-content;
    width: min-content;
  }
</style>
