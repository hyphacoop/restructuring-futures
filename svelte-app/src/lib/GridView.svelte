<script>
  import FileSharing from "./FileSharing.svelte";
  import { onMount, afterUpdate } from "svelte";
  import { onDestroy } from "svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import authorKeypair from "../store/identity";
  import cacheDetails from "../store/cache";
  import { time } from "../store/time";

  import GridUpload from "./GridUpload.svelte";
  import View from "./Artifacts/View.svelte";
  import Icon from "./Artifacts/Icon.svelte";
  import Upload from "./Artifacts/Upload.svelte";
  import DocDetails from "./DocDetails.svelte";
  import OrbitingReplies from "./OrbitingReplies.svelte";

  import DownloadTool from "./DownloadTool.svelte";
  import DeleteTool from "./DeleteTool.svelte";

  import { calculateLunarPhase } from './utils/lunarPhase.js';
  import { createObserver, observeElement, disconnectObserver } from './utils/scrollObserver.js';
  import { LUNAR_PHASE, COLOR_CYCLE } from './utils/constants.js';

  export let showDetails = true;
  export let IDcreated = false;
  export let attachment = true;
  export let isReply = false;

  let grid = [6, 9];

  let gridState = Array(grid[0]).fill().map(() => Array(grid[1]).fill(false));

  let documents = [];

  // multiply x 1000 to convert to microseconds
  let usTime = $time.getTime() * 1000;

  let isMobile = false;
  let observer;
  let currentColor = COLOR_CYCLE[0];

  function updateObserver() {
    disconnectObserver(observer);

    let threshold;
    if (window.innerWidth <= 480) { // for small screens
        threshold = 0.1;
    } else if (window.innerWidth <= 768) { // for medium screens
        threshold = 0.15;
    } else { // for large screens
        threshold = 0.5;
    }

    const callback = (entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          let sectionIndex = parseInt(entry.target.getAttribute('id').replace('section', ''));
          currentColor = COLOR_CYCLE[sectionIndex % COLOR_CYCLE.length];
        }
      });
    };

    observer = createObserver(callback, threshold);
  }

  afterUpdate(() => {
    LUNAR_PHASE.forEach((_, k) => {
      const element = document.querySelector(`#section${k}`);
      observeElement(observer, element);
    });
  });


  onDestroy(() => {
    disconnectObserver(observer);
  });

  let imageView = true;
  let selectedDocument = null;
  let selectedX, selectedY;
  let uploadView = false;
  let filetype = null;
  let xy = [0, 0];
  let col;
  let row;

  // Use $cacheDetails to access the current value, or subscribe to changes.
  cacheDetails.subscribe(value => {
    console.log("Cache details changed:", value);
});

  $: if (selectedDocument) {
    let splitPath = selectedDocument.path.split("/");
    selectedX = splitPath[2];
    selectedY = splitPath[3];
  }

  function selectDocument(doc) {
    selectedDocument = doc;
    console.log("selecteddoc", doc);
  }

  // fetch documents
  const fetchDocs = async () => {
    documents = $cacheDetails.queryDocs({
      filter: {
        pathStartsWith: "/documents",
      },
    });
    documents = documents.filter((doc) => doc.path.split("/").length <= 6);
    console.log("Docs", documents);
    gridState = calculateLunarPhase(documents);
  };

  $cacheDetails.onCacheUpdated(() => {
    fetchDocs();
  });

  onMount(() => {
  fetchDocs();
});

  function handleClick() {
    imageView = !imageView;
    selectedDocument = null;
  }

  function toggleDetails() {
    dispatch("toggle");
  }
  function handleKeydown(e) {
    // Check if key pressed is 'Escape' key
    if (e.key === "Escape") {
      selectedDocument = null;
    }
  }
  function handleSelection(event) {
    uploadView = true;
    imageView = true;
    selectedDocument = null;
    filetype = event.detail.type;
    xy = event.detail.location;
    console.log("filetype", filetype);
    console.log("xy", xy);
  }
  function successfulUpload() {
    uploadView = false;
    imageView = true;
    selectedDocument = null;
    filetype = null;
    xy = [0, 0];
  }
  function backToView() {
    uploadView = false;
    imageView = true;
    selectedDocument = null;
    filetype = null;
    xy = [0, 0];
  }

  let windowWidth;

  $: windowWidth = window.innerWidth;

  $: {
    if (windowWidth <= 768) {
      isMobile = true;
      col = "repeat(3, minmax(min-content, 1fr))";
      row = "repeat(18, minmax(min-content, 1fr))";

    } else {
      isMobile = false;
      col = "repeat(" + grid[1] + ", minmax(min-content, 1fr))";
      row = "repeat(" + grid[0] + ", minmax(min-content, 1fr))";
    }
    updateObserver();
  }

  onMount(() => {
    windowWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      windowWidth = window.innerWidth;
    });
  });

</script>

<div
  class="w-screen flex flex-row justify-end h-[10vh]"
  on:click={() => (selectedDocument = null)}
  on:keydown={handleKeydown}
>
  {#if IDcreated}
    <button class="h-auto mr-6" on:click={toggleDetails}>
      {#if !showDetails}
        {$authorKeypair.address.slice(0, 5)}
      {:else}
        Hide details
      {/if}
    </button>
    <!-- I created some utility function to delete and download the database -->
    <!--
    <DownloadTool />

    <DeleteTool />
        -->
  {/if}
</div>
<div class="the-scroll flex min-h-screen overflow-y-auto">
  <div
    class="mx-1 mt-10 w-1/5 side-bar flex flex-col p-8 h-[80vh] fixed z-50"
    style="
    background-color: {currentColor};
    transition: background-color 1s ease;
    "
  >
    <p>
      {selectedDocument
        ? `Grid [${selectedX}, ${selectedY}]`
        : "No document selected"}
    </p>
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
  <div class="w-[80vw] mt-10 ml-[20vw]">
    <div class="my-grid-container-wrapper">
      {#if selectedDocument}
        <div class="artifact-overlay mt-[14vh] h-[80vh] w-4/5 fixed">
          <View {selectedDocument} on:close={() => (selectedDocument = null)} />
        </div>
      {:else if !imageView}
        <div class="relative" style="z-index:51;">
          <GridUpload
            {windowWidth} 
            on:success={() => (imageView = !imageView)}
            on:upload={() => (imageView = !imageView)}
            on:selected={handleSelection}
          />
        </div>
      {:else if uploadView}
        <div class="relative" style="z-index:51;">
        <Upload
          {filetype}
          {xy}
          on:success={successfulUpload}
          on:close={backToView}
        />
        </div>
      {/if}
      <div class="flex flex-col w-auto">
        {#if documents.length === 0}
          <div
            class="flex flex-col items-center justify-center align-middle h-[60vh]"
          >
            <h3 class="p-6">No files yet</h3>
          </div>
        {:else}
          {#each LUNAR_PHASE as phase, k (k)}
          <h1>
            {k}
          </h1>
            <div
              id={`section${k}`}
              class="my-grid-container w-screen"
              style={`background-color: ${COLOR_CYCLE[k]}; ${
                isMobile
                ? 'grid-template-columns: repeat(3, 1fr); grid-template-rows: auto;'
                : `grid-template-columns: ${col}; grid-template-rows: ${row};`
            }`}
            >
              {#each { length: grid[0] } as _, i (i)}
                {#each { length: grid[1] } as _, j (j)}

                    {#if isMobile}

                        {#if gridState[j][i] && gridState[j][i].length > 0}
                          <div id={`phase${k}_cell_${i}_${j}`} class="grid-cell">
                            {i},{j}
                            {#each gridState[j][i] as artifact}
                              <div id={i + j + artifact.doc.textHash + artifact.doc.timestamp} class='orbit-icon-container'>
                                {#if artifact.lunarPhase === k}
                                  <OrbitingReplies doc={artifact.doc} />
                                  <div class="orbit-icon">
                                    <Icon doc={artifact.doc} 
                                    on:click={() => selectDocument(artifact.doc)}/>
                                  </div>

                                {:else}

                                  <OrbitingReplies doc={artifact.doc} disabled={true} />
                                  <div class="orbit-icon">
                                    <Icon doc={artifact.doc} disabled={true} />
                                  </div>

                                {/if}
                              </div>
                            {/each}
                          </div>
                        {/if}

                    {:else}
                    <div class="grid-cell">
                      {i},{j}
                      {#if documents.find((doc) => parseInt(doc.path.split("/")[2]) == i && parseInt(doc.path.split("/")[3]) == j)}
                        {#each documents.filter((doc) => parseInt(doc.path.split("/")[2]) == i && parseInt(doc.path.split("/")[3]) == j) as doc (doc.textHash + doc.timestamp)}
                          <div id={doc.textHash + doc.timestamp} class='orbit-icon-container'>
                            
                            

                            {#if phase == LUNAR_PHASE[0]}
                              {#if usTime < doc.deleteAfter - phase == false}
                              <OrbitingReplies {doc} disabled={true} />
                              <div class="orbit-icon">
                                <Icon {doc} disabled={true} />
                              </div>
                              {:else}
                              <OrbitingReplies {doc} />
                              <div class="orbit-icon">
                                <Icon
                                  {doc}
                                  on:click={() => selectDocument(doc)} 
                                />
                              </div>
                              {/if}
                            {:else if (usTime < doc.deleteAfter - phase && usTime > doc.deleteAfter - (phase + 639360000000)) == false}
                              <OrbitingReplies {doc} disabled={true} />  
                              <div class="orbit-icon">  
                                <Icon {doc} disabled={true} />
                              </div>
                            {:else}
                            <OrbitingReplies {doc} />
                              <div class="orbit-icon">
                                <Icon {doc} on:click={() => selectDocument(doc)} />
                              </div>  
                            {/if}


                          
                          </div>
                        {/each}
                      {/if}
                    </div>
                  {/if}
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
  .orbit-icon-container {
    position: relative;
    display: inline-block;
  }

  .orbit-icon {
    position: relative;
    z-index: 2;
  }

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
    border: 0px solid #ccc;
  }
  .my-grid-container-wrapper {
    position: relative;
    z-index: 50;
  }

  .artifact-overlay {
    top: 0;
    left: 20vw;
    z-index: 5;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    background-color: rgba(255, 255, 255, 1);
    margin-left: 2px;
  }
</style>
