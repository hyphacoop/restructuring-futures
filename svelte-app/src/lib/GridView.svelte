<script>
  import FileSharing from "./FileSharing.svelte";
  import { onMount } from "svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import authorKeypair from "../store/identity";
  import cache from "../store/cache";
  import { time } from "../store/time";

  import SingleDoc from "./SingleDoc.svelte";

  let grid = [9, 16];

  $: col = 'repeat(' + grid[0] + ', 1fr)';
$: row = 'repeat(' + grid[1] + ', 1fr)';

  let documents = [];
  let oracle = true;

  // durations in milliseconds
  let hours = [ 10800000000, 7200000000, 3600000000, 0];
  let lunarphase = [ 1918080000000, 1278720000000, 639360000000, 0];

  // multiply x 1000 to convert to microseconds
  let usTime = $time.getTime() * 1000;
  let colorCycle = ["#fff5d9", "#d3e3d9","#F9DFDD", "#CCE9F0"]

  export let inStudio;
  export let showDetails = true;
  export let IDcreated = false;

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

  function handleClick() {
    dispatch('view');
  }
  function handleDetails() {
    dispatch('details');
  }

  $: documents = documents;
</script>
<div class="w-screen flex flex-row justify-end">
  {#if IDcreated}
    <button class="topleft m-6" on:click={handleDetails}>
      {#if showDetails}
      {$authorKeypair.address.slice(0, 5)}
      {:else}
     
      Hide identity details
      {/if}
    </button>
  {/if}
</div>
<div class="flex min-h-screen overflow-y-auto">
  <div class="mx-1 mt-12 w-1/5 paper-yellow flex flex-col p-8 h-[80vh] sticky top-0">
    <button on:click={handleClick} class="mb-12">
      Place an artefact
    </button>
  </div>
  <div class="w-4/5 ml-auto">
    <div>
      <!--
        Disabling the oracle button until further notice
        <FileSharing {oracle} {inStudio}/>
        -->
      <div class='flex flex-col w-screen'>
          {#if documents.length === 0}
              <p>No files yet</p>
          {:else}
            {#each hours as hour, k (k)}
            <div
            class="my-grid-container w-screen"
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
  </div>
</div>


<!-- Displays coordinates of selected area 
    <strong>Coords:</strong> {start} {end[0] ? '-' : ''} {end} -->
<style>
  .my-grid-container {
    display: grid;
    border-radius: 2px;
    width: 80vw;
    min-height: 100vh;
    grid-gap: 0px;
  }

  .my-grid-container div {
    height:100%;
    width: 100%;
    flex: 1 0 auto;
  }
</style>
