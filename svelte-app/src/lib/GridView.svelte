<script>
  import FileSharing from "./FileSharing.svelte";
  import { onMount } from "svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import authorKeypair from "../store/identity";
  import cache from "../store/cache";
  import { time } from "../store/time";

  import SingleDoc from "./SingleDoc.svelte";
  import GridUpload from "./GridUpload.svelte";
  import ArtifactView from './ArtifactView.svelte';
  import ArtifactIcon from "./ArtifactIcon.svelte";
  import ArtifactUpload from "./ArtifactUpload.svelte";
  import DocDetails from "./DocDetails.svelte";



  let grid = [9, 16];

  $: col = 'repeat(' + grid[1] + ', minmax(min-content, 1fr))';
  $: row = 'repeat(' + grid[0] + ', minmax(min-content, 1fr))';

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
  export let attachment = true;
  export let isReply = false;

  let imageView = true;
  let selectedDocument = null;
  let selectedX, selectedY;
  let uploadView = false;
  let filetype = null;
  let xy = [0, 0];

$: if (selectedDocument) {
    let splitPath = selectedDocument.path.split("/");
    selectedX = splitPath[2];
    selectedY = splitPath[3];
    console.log('selectedX', selectedX);
  console.log('selectedY', selectedY);
  console.log('selectedDocument in GridView', selectedDocument);
}
  
  function selectDocument(doc) {
  selectedDocument = doc;
  console.log('selecteddoc', doc);

  }



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
    imageView = !imageView;
    selectedDocument = null;
  }
  function handleDetails() {
    dispatch('details');
  }
  function toggleDetails() {
    dispatch('toggle');
  }
  function handleKeydown(e) {
    // Check if key pressed is 'Escape' key
    if(e.key === 'Escape'){
        selectedDocument = null;
    }
  }
  function handleSelection(event) {
      uploadView = true;
      imageView = true;
      selectedDocument = null;
      filetype = event.detail.type;
      xy = event.detail.location;
      console.log('filetype', filetype);
      console.log('xy', xy)
  }
  function successfulUpload() {
    uploadView = false;
    imageView = true;
    selectedDocument = null;
    filetype = null;
    xy = [0, 0];
  }
</script>
<div class="w-screen flex flex-row justify-end h-[10vh]" on:click={() => selectedDocument = null} on:keydown={handleKeydown}>
  {#if IDcreated}
    <button class="topleft m-6" on:click={toggleDetails}>
      {#if !showDetails}
       {$authorKeypair.address.slice(0, 5)}
      {:else}
       Hide details
      {/if}
    </button>
  {/if}
</div>
<div class="the-scroll flex min-h-screen overflow-y-auto">
  <div class="mx-1 mt-12 w-1/5 paper-yellow flex flex-col p-8 h-[80vh] fixed">

    <p>{selectedDocument ? `Grid [${selectedX}, ${selectedY}]` : 'No document selected'}</p>

    {#if selectedDocument}
    <div>
      <DocDetails doc={selectedDocument} {attachment} {isReply} />
  </div>
  {/if}
    <button on:click={handleClick} class="mb-12">
      {#if imageView}
      Place an artefact
      {:else}
      Back to viewing
      {/if}
    </button>

  </div>
  <div class="w-4/5 mt-12 ml-auto">
    <div class="my-grid-container-wrapper">
      {#if selectedDocument}
      <div class="artifact-overlay mt-[15vh] h-[80vh] w-4/5 fixed">
        <ArtifactView {selectedDocument} on:close={() => selectedDocument = null} />
      </div>
      {:else if !imageView}

      <div>
        <GridUpload on:success={() => (imageView = !imageView)} on:upload={() => (imageView = !imageView)} {inStudio} on:selected={handleSelection}/>
      </div>
      {:else if uploadView}
        <ArtifactUpload {filetype} {xy} on:success={successfulUpload} />
      {/if}
      <div class='flex flex-col w-screen'>
          {#if documents.length === 0}
              <p>No files yet</p>
          {:else}
            {#each lunarphase as phase, k (k)}
            <div
            class="my-grid-container w-screen"
            style="grid-template-rows: {row}; grid-template-columns: {col}; background-color: {colorCycle[k]};"
            >         

              {#each { length: grid[0] } as _, i (i)}
                {#each { length: grid[1] } as _, j (j)}
                  <div class="grid-cell">
                    {i},{j}
                    {#if documents.find(doc => parseInt(doc.path.split('/')[2]) == i && parseInt(doc.path.split('/')[3]) == j)}
                    {#each documents.filter(doc => parseInt(doc.path.split('/')[2]) == i && parseInt(doc.path.split('/')[3]) == j) as doc (doc.textHash+doc.timestamp)}
                        <div id={doc.textHash+doc.timestamp}>

                              {#if phase == lunarphase[0]}
    
                                {#if usTime < (doc.deleteAfter - phase) == false}
                                  <ArtifactIcon {doc} disabled={true} />
                                  <!-- <SingleDoc {doc} on:update={updateUI} {inStudio} disabled={true} />-->
                                {:else}
                                  <!-- <SingleDoc {doc} on:update={updateUI} {inStudio} on:click={() => selectDocument(doc)} />-->
                                  <ArtifactIcon {doc} on:click={() => selectDocument(doc)} />
                                {/if}
                              {:else}
                                {#if (usTime < (doc.deleteAfter - phase) && (usTime > (doc.deleteAfter - (phase + 639360000000)))) == false}
                                  <!-- <SingleDoc {doc} on:update={updateUI} {inStudio} disabled={true} />-->
                                  <ArtifactIcon {doc} disabled={true} />
                                {:else}
                                  <!-- <SingleDoc {doc} on:update={updateUI} {inStudio} on:click={() => selectDocument(doc)} />-->
                                  <ArtifactIcon {doc} on:click={() => selectDocument(doc)} />
                                {/if}
                              {/if}
                          </div>
                          {/each}
                        {/if}
                    </div>
                  {/each}
                {/each}

            </div>
            {/each}
          {/if}
        </div>
    </div>
  </div>
</div>


<style>

  .the-scroll {
    overflow: auto;
  }
  .my-grid-container {
    display: grid;
    border-radius: 2px;
    width: 80vw;
    min-height: 100vh;
    grid-gap: 4px;
  }

  .my-grid-container div {
    width: 100%;
    flex: 1 0 auto;
  }

  .grid-cell {
  border: 1px solid #ccc;
}
.my-grid-container-wrapper {
  position: relative; /* this allows absolute positioning within */
}

.artifact-overlay {
  top: 0;
  left: 20vw;
  z-index: 10; /* set this to be higher than the z-index of your grid view */
  display: flex;
  align-items: start;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 1); /* Optional: this will create a semi-transparent overlay effect */
  margin-left:2px;
}
</style>
