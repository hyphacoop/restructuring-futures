<script>
  import FileSharing from "./FileSharing.svelte";
  import { onMount, afterUpdate } from "svelte";
  import { onDestroy } from "svelte";
  import { get } from 'svelte/store';
  import { createEventDispatcher } from "svelte";

  import authorKeypair from "../store/identity";
  import cacheDetails from "../store/cache";
  import settings from "../store/settings";
  import { time } from "../store/time";
  import shareKeypair from "../store/share";
  import { studioGridStore, setIsCellOccupied, commonsGridStore, isCommonsCellOccupied } from '../store/GridState';


  import numberToLetter from "./utils/numberToLetter";
  import pathToXY from "./utils/pathToXY";

  import GridUpload from "./GridUpload.svelte";
  import View from "./Artefacts/View.svelte";
  import Icon from "./Artefacts/Icon.svelte";
  import Upload from "./Artefacts/Upload.svelte";
  import DocDetails from "./DocDetails.svelte";
  import OrbitingReplies from "./OrbitingReplies.svelte";
  import StudioPortal from "./Components/StudioPortal.svelte";
  import ServerList from "./Components/ServerList.svelte";

  import DownloadTool from "./DownloadTool.svelte";
  import DeleteTool from "./DeleteTool.svelte";

  import { calculateLunarPhase, countArtefactsInEachPhase } from './utils/lunarPhase.js';
  import { createObserver, observeElement, disconnectObserver } from './utils/scrollObserver.js';
  import { LUNAR_PHASE, COLOR_CYCLE, PHASE_NAME } from './utils/constants.js';
  import { extractPageNumber } from "./utils/extractPageNumber";

  import PlaceFromStudio from "./Components/PlaceFromStudio.svelte";
  import CreatePage from "./Components/CreatePage.svelte";

  export let showDetails = true;
  export let IDcreated = false;
  export let attachment = true;
  export let isReply = false;
  export let readManual = false;

  const studioShareAddress = import.meta.env.VITE_STUDIO_SHARE_ADDRESS;
  const studioSecret = import.meta.env.VITE_STUDIO_SECRET;

  const MAX_RETRIES = 8;
  let retryCount = 0;

  let grid = [6, 9];
  let pages = [];
  let allPagesDocs;

  let loadingText = "Looking for artefacts..."

  let sectionIndex = 0;

  let gridState = Array(grid[0]).fill().map(() => Array(grid[1]).fill(false));

  let documents = [];

  let replies = false;

  // multiply x 1000 to convert to microseconds
  let usTime = $time.getTime() * 1000;

  let isMobile = false;
  let observer;
  let currentColor = COLOR_CYCLE[0];

  const dispatch = createEventDispatcher();

  let currentShare = get(shareKeypair).shareAddress;

  shareKeypair.subscribe(value => {
    currentShare = value.shareAddress;
  });

  function backToCommons() {
  loadingText = 'Looking for artefacts...';
  const shareAddress = import.meta.env.VITE_COMMONS_ADDRESS;
  const secret = settings.shareSecrets[shareAddress]; // retrieve the secret
  shareKeypair.set({shareAddress, secret});
  switchShare(); // set both shareAddress and secret
  selectedDocument = null;
  imageView = true;
  readManual = false;
  dispatch('resetManual');
}

  function updateObserver() {
    disconnectObserver(observer);

    let threshold;
    if (window.innerWidth <= 768) { // for smaller screens
        threshold = 0.45;
    } else { // for large screens
        threshold = 0.5;
    }

    const callback = (entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          sectionIndex = parseInt(entry.target.getAttribute('id').replace('section', ''));
          currentColor = COLOR_CYCLE[sectionIndex % COLOR_CYCLE.length];
        }
      });
    };

    observer = createObserver(callback, threshold);
  }

  afterUpdate(() => {
   if (currentShare.includes('commons')) {
    LUNAR_PHASE.forEach((_, k) => {
      const element = document.querySelector(`#section${k}`);
      observeElement(observer, element);
    });}

  });


  onDestroy(() => {
    disconnectObserver(observer);
  });

  let imageView = true;
  let selectedDocument = null;
  let scaledX, scaledY;
  let uploadView = false;
  let filetype = null;
  let showStudio = false;
  let isCommons;
  let sharePart;
  let xy = [0, 0];
  let col;
  let row;

  let artefactsInPhase0 = 0;
  let artefactsInPhase1 = 0;
  let artefactsInPhase2 = 0;
  let artefactsInPhase3 = 0;
  let artefactsInCurrentPhase = 0;


  // Use $cacheDetails to access the current value, or subscribe to changes.
  cacheDetails.subscribe(value => {
    console.log("Cache details changed:", value);
});

  $: if (selectedDocument) {
    let XY = pathToXY(selectedDocument.path);
    console.log('XY', XY);
    scaledX = XY[1];
    scaledY = XY[0];
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
        

    if (isCommons){

    // Filter out documents by path length and empty or whitespace-only text content
    documents = documents.filter((doc) => {
        return doc.path.split("/").length <= 6 && doc.text.trim() !== "";
    });

    //console.log("Docs", documents);

    gridState = calculateLunarPhase(documents);
    //console.log('gridState', gridState);


    $commonsGridStore = {}; // Reset the store initially
    // Check isCommonsCellOccupied
    isCommonsCellOccupied(documents);

    const counts = countArtefactsInEachPhase(gridState);
    artefactsInPhase0 = counts.artefactsInPhase0;
    artefactsInPhase1 = counts.artefactsInPhase1;
    artefactsInPhase2 = counts.artefactsInPhase2;
    artefactsInPhase3 = counts.artefactsInPhase3;

    } else {
      loadingText = 'Looking for artefacts...';
      console.log('looking for pages');
      // Group documents by page
      let groupedDocs = {};

     
    // First, filter the documents based on the same criteria
    documents = documents.filter(doc => {
    const pageNumber = extractPageNumber(doc);
    const pathDepth = pageNumber === 1 ? 6 : 7;

     // look for additionnal pages
     const isNewPageFormat = doc.path.endsWith('/newPage') && doc.text.trim() !== "";
    return (
      (doc.path.split("/").length <= pathDepth && doc.path.split("/").length >= 5 && doc.text.trim() !== "") || 
        isNewPageFormat
        );
});

// Now, group the filtered documents by page number
  documents.forEach(doc => {
    const pageNumber = extractPageNumber(doc);
    //console.log('pageNumber', pageNumber);
    if (!groupedDocs[pageNumber]) {
        groupedDocs[pageNumber] = [];
    }
    groupedDocs[pageNumber].push(doc);
});

// Logs
console.log(groupedDocs, 'groupedDocs');

// Convert groupedDocs to a format which includes the gridState
$studioGridStore = {}; // Reset the store initially

for (let pageKey in groupedDocs) {
    let pageNumber = parseInt(pageKey);
    setIsCellOccupied(groupedDocs[pageKey], pageNumber);
}

// Logs
console.log($studioGridStore, 'studioGridStore');


    allPagesDocs = Object.values(groupedDocs);
    console.log('allPagesDocs', allPagesDocs);
    setTimeout(() => {
        showStudio = true;
      }, 500);
    }
  };

  $: {
    switch (sectionIndex) {
        case 0:
            artefactsInCurrentPhase = artefactsInPhase0;
            break;
        case 1:
            artefactsInCurrentPhase = artefactsInPhase1;
            break;
        case 2:
            artefactsInCurrentPhase = artefactsInPhase2;
            break;
        case 3:
            artefactsInCurrentPhase = artefactsInPhase3;
            break;
    }
}


  $cacheDetails.onCacheUpdated(() => {
    console.log('cache updated');
    setTimeout(() => {
      fetchDocs();
    }, 500);
  });

  $: {
  if (documents.length === 0) {
    if (retryCount < MAX_RETRIES) {
      console.log('no docs');
      retryCount++;
      setTimeout(() => {
        fetchDocs();
      }, 2000);
      loadingText = 'Looking for artefacts...';
    } else {
      // If max retries reached
      loadingText = 'No artefacts were found';
    }
  } else {
    // Reset retry count if documents are found
    retryCount = 0;
  }
}

  onMount(() => {
    console.log('onMount')
  fetchDocs();
});

  let showPlace = false;

  function PlaceFromStudioFunction() {
    showPlace = !showPlace;
    imageView = !imageView;
  }

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
    setTimeout(() => {
      fetchDocs();
    }, 500);
  }

  function switchShare() {
    documents = [];
    currentShare = get(shareKeypair).shareAddress;
    setTimeout(() => {
      fetchDocs();
    }, 500);
    showPlace = false;
    imageView = true;
  }

$: if (readManual){
  loadingText = "Loading manual..."
    currentShare = get(shareKeypair).shareAddress;
    if (currentShare.includes('commons')) {
      let shareAddress = studioShareAddress;
      let secret = studioSecret;
      shareKeypair.set({shareAddress, secret});
      switchShare(); // set both shareAddress and secret
      };
      setTimeout(() => {
      fetchDocs();
    }, 500);
    setTimeout(() => {
      selectedDocument = {
        _localIndex: 2,
        attachmentHash: "b7hrknufwimzdxqx6wfbo76hkmnmlji6rr7r2wnjzelnwwk3jvxxq",
        attachmentSize: 108,
        author: "@xbqy.bawslhcbis7ujno6putocezx74tsozhccashfhlv7hxtyuttp37pa",
        format: "es.5",
        path: "/documents/0/0/1691530547348/text-input-by-xbqy.md",
        share: "+studio.bywytquv2ypa7qqwtj3gbuel5fnqh6w5n5yecdqbwzsr4keativ3a",
        shareSignature: "bei64didblih3syu7uuchqtlnpnqq7grsjjh7pfnttv6wuutp75a7ur3oam2h2xthmm3anpuqqszwqntgdrfivi5ijvihhkxoston4dy",
        signature: "bs6ssixzdrysg3cx6awirx6465xfufo5kml6gal6ue2scyzppsafgsnx5cyf7b65zlhrrxiwe4wpv3vumgf7yvusctpijhfo6dgo4oba",
        text: "Text input by xbqy on 8/8/2023#Title: Placeholder manual#Notes: This is to test links to studio artefacts",
        textHash: "byn2h46gvhtw7exw2rvjiq54fv2ubfhenhebbllpk3egcielzn2la",
        timestamp: 1691530616881000,
      };
      loadingText = "Looking for artefacts..."
    }, 600);
    readManual = false;
    dispatch('resetManual');
};

$: {
  sharePart = currentShare.split('+')[1].split('.')[0];
  isCommons = sharePart.includes('commons');
  if (!isCommons && allPagesDocs !== undefined){
    pages = allPagesDocs.map((docs, index) => ({
        pageNumber: index + 1, // This assumes pages are in sequential order
        documents: docs
    }));
    console.log('pages: ', pages)
        };
}
  let windowWidth;

  $: windowWidth = window.innerWidth;

  $: console.log(sectionIndex);

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


  function resetView() {
    selectedDocument = null;
    imageView = true;
    showPlace = false;
    switchShare();
  }
</script>

<div
  class="w-screen flex flex-row justify-start h-auto"
  on:click={() => (selectedDocument = null)}
  on:keydown={handleKeydown}
>
    <!-- I created some utility function to delete and download the database -->
    <!--
    <DeleteTool />
        -->

</div>
<div class="the-scroll flex flex-row sm:flex-col min-h-screen overflow-y-auto">
  <div class='sm:w-1/5 flex flex-col side-bar fixed '>
  <button class="ml-6 mt-4 mb-2 h-auto mr-1" on:click={toggleDetails}>
    🔮 app customization
  </button>
  <p class='ml-6 text-2xl text-left'><b>
    current alias:
  </b>{$authorKeypair.address.slice(0, 5)}</p>
  <div
    class="ml-6 mx-1 sm:mt-4 flex flex-row justify-between sm:flex-col p-8 h-auto sm:h-[80vh] z-50 customBorder"
    style="
    {isCommons ? `background-color: ${currentColor};` : `background-color: white;`}
    transition: background-color 1s ease;
    {isCommons ? `color: #71302B;` : `color: black;`}; 
    "
  >
  {#if selectedDocument}
  <div>
    <DocDetails doc={selectedDocument} {attachment} {isReply} {isCommons}/>
  </div>
{:else}
<div>
  <h6 class='text-left'>{sharePart} status</h6>
  <p class="text-left text-xl font-bold mb-2">
    {selectedDocument
      ? `${scaledY}, ${scaledX} `
      : ""}
  </p>
  <div class="text-left font-bold mb-2">
    Workspace Address:
    <p class='truncate ...'>
      {currentShare}
    </p>
  </div>
  <div class="text-left font-bold mb-2">
    Current {settings.servers.length === 1
      ? "Server:"
      : `${settings.servers.length} Servers:`}<br>
    <ServerList truncate={true} />
  </div>
    <div class="flex flex-col justify-left">
      {#if isCommons}
       <p class='text-left'><b>Phase of decay:</b> {PHASE_NAME[sectionIndex]}</p>
       <p class='text-left'><b>Number of artefacts in this phase:</b> {artefactsInCurrentPhase}</p>
      {/if}
  <p class='text-left'><b>Number of artefacts in the {sharePart}:</b> {documents.length}</p>
  </div>
</div>
<div class='flex flex-col w-full'>
  {#if !isCommons}
  <div class='w-auto py-4'>
  <DownloadTool shareAddress={currentShare} isStudio={true} />
  </div>
  <div class='w-auto flex flex-col'>
  <button on:click={backToCommons}>take me back to Commons</button>
  </div>
  {/if}
  {#if (isCommons && sectionIndex === 0) || !isCommons || !imageView}
    <div class='w-full flex flex-col py-4'>
      {#if isCommons}
        <button on:click={PlaceFromStudioFunction}>
        
          {#if imageView}
            Place artefact from the studio
          {:else}
            Back to viewing
          {/if}

        </button>
      {:else}
        <button on:click={handleClick}>
        
        {#if imageView}
          Place an artefact
        {:else}
          Back to viewing
        {/if}

      </button>
      {/if}

    </div>

  {/if}
</div>
{/if}
  
    </div>
  </div>
  <div class="w-4/5 mt-16 sm:mt-4 sm:ml-[20vw]">
    <div class="my-grid-container-wrapper w-auto pl-4 ml-4">
      {#if showPlace}
      <PlaceFromStudio {windowWidth} on:hideWindow={resetView} on:artefactPlaced={fetchDocs}/>
      {/if}
      {#if selectedDocument}
        <div class="artefact-overlay customBorder mt-[12vh] h-[80vh] w-4/5 fixed max-w-overlay">
          <View {selectedDocument} on:close={() => (selectedDocument = null)} />
        </div>
      {:else if !imageView && !showPlace}
        <div class="relative pt-12" style="z-index:51;">
          <GridUpload
            {windowWidth} 
            on:success={() => (imageView = !imageView)}
            on:upload={() => (imageView = !imageView)}
            on:selected={handleSelection}
            {pages}
          />
        </div>
      {:else if uploadView}
        <div class="relative" style="z-index:51;">
        <Upload
          {filetype}
          {xy}
          on:success={successfulUpload}
          on:close={successfulUpload}
        />
        </div>
      {/if}
      <div class="flex flex-col w-auto mt-6">
        {#if documents.length === 0}
          <div
            class="flex flex-col items-center justify-center align-middle h-[60vh]"
          >
            <h3 class="p-6">{loadingText}</h3>
          </div>
        {:else}
        {#if isCommons}
        <StudioPortal topOfCommons={true} on:shareUpdated="{switchShare}" />
          {#each LUNAR_PHASE as phase, k (k)}
            <div
              id={`section${k}`}
              class="my-grid-container w-screen h-full commons-border {k === 0 ? "top-border" : ""} {k === 3 ? "bottom-border" : ""}"
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
                          <div id={`phase${k}_cell_${i}_${j}`} class="grid-cell h-full">
                            {i},{j}
                            {#each gridState[j][i] as artefact}
                              <div id={i + j + artefact.doc.textHash + artefact.doc.timestamp} class='orbit-icon-container h-full'>
                                {#if artefact.lunarPhase === k}
                                  <OrbitingReplies doc={artefact.doc} />
                                  <div class="orbit-icon h-full">
                                    <Icon {replies} phase={k} doc={artefact.doc} 
                                    on:click={() => selectDocument(artefact.doc)}/>
                                  </div>

                                {:else}

                                  <OrbitingReplies doc={artefact.doc} disabled={true} />
                                  <div class="orbit-icon">
                                    <Icon {replies} phase={k}  doc={artefact.doc} disabled={true} />
                                  </div>

                                {/if}
                              </div>
                            {/each}
                          </div>
                        {/if}

                    {:else}
                    <div id="{j}+{i}+{k}" class="grid-cell 
                    {i === 0 && k === 0 ? 'top-row-offset' : ''} 
                    {j === 0 && imageView ? 'first-col-offset' : ''}"
                    data-letter={i === 0 ? numberToLetter(j) : ''}
                    data-number={j === 0 ? i + 1 : ''}
                    >
                   
                      {#if documents.find((doc) => parseInt(doc.path.split("/")[2]) == i && parseInt(doc.path.split("/")[3]) == j)}
                        {#each documents.filter((doc) => parseInt(doc.path.split("/")[2]) == i && parseInt(doc.path.split("/")[3]) == j) as doc (doc.textHash + doc.timestamp)}
                          <div id={doc.textHash + doc.timestamp} class='orbit-icon-container'>

    
                            {#if (usTime < doc.deleteAfter - phase && usTime > doc.deleteAfter - (phase + 639360000000)) == false}

                            <OrbitingReplies {doc} disabled={true} />  
                              <div class="orbit-icon">  
                                <Icon {replies} phase={k}  {doc} disabled={true} />
                              </div>
                            {:else}
                            <OrbitingReplies {doc} />
                              <div class="orbit-icon">
                                <Icon {replies} phase={k}  {doc} on:click={() => selectDocument(doc)} />
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
                  <StudioPortal on:shareUpdated="{switchShare}"/>
          {:else}
          {#if showStudio}
          {#each pages as page (page.pageNumber)}
          <div
          id={`Studio-page${page.pageNumber}`}
          class="my-grid-container studio-grid w-screen mb-32"
          style={`background-color: white; ${
            isMobile
            ? 'grid-template-columns: repeat(3, 1fr); grid-template-rows: auto;'
            : `grid-template-columns: ${col}; grid-template-rows: ${row};`
        }`}
        >
          {#each { length: grid[0] } as _, i (i)}
            {#each { length: grid[1] } as _, j (j)}

                {#if isMobile}

                    {#if gridState[j][i] && gridState[j][i].length > 0}
                      <div id={`Studio_cell_${i}_${j}`} class="grid-cell">
                        {i},{j}
                        {#each gridState[j][i] as artefact}
                          <div id={i + j + artefact.doc.textHash + artefact.doc.timestamp} class='orbit-icon-container'>
                              <OrbitingReplies doc={artefact.doc} />
                              <div class="orbit-icon">
                                <Icon {replies} phase={1} doc={artefact.doc} 
                                on:click={() => selectDocument(artefact.doc)}/>
                              </div>
                          </div>
                        {/each}
                      </div>
                    {/if}

                {:else}
                <div class="borderstudio relative {i === 0 ? 'top-row-offset' : ''} 
                    {j === 0 && imageView ? 'first-col-offset' : ''}"
                    data-letter={i === 0 ? numberToLetter(j) : ''}
                    data-number={j === 0 ? i + 1 : ''}>
                
                  {#if page.documents.find((doc) => parseInt(doc.path.split("/")[page.pageNumber === 1 ? 2 : 3]) == i && parseInt(doc.path.split("/")[page.pageNumber === 1 ? 3 : 4]) == j)}
                    {#each page.documents.filter((doc) => parseInt(doc.path.split("/")[page.pageNumber === 1 ? 2 : 3]) == i && parseInt(doc.path.split("/")[page.pageNumber === 1 ? 3 : 4]) == j) as doc (doc.textHash + doc.timestamp)}
                      <div id={doc.textHash + doc.timestamp} class='orbit-icon-container'>
                          <OrbitingReplies {doc} />
                          <div class="orbit-icon">
                            <Icon {replies} phase=0 
                              {doc}
                              on:click={() => selectDocument(doc)} 
                            />
                          </div>                      
                      </div>
                    {/each}
                  {/if}
                </div>
              {/if}
            {/each}
          {/each}
          <p class='text-left'>page {page.pageNumber}</p>
        </div>

        {/each}
        <CreatePage on:createPage={fetchDocs}/>
        <StudioPortal on:shareUpdated="{switchShare}"/>
        {/if}
          {/if}
        {/if}

      </div>
    </div>
  </div>
</div>


<style>
  .customBorder {
    border: 1px solid #71302B; 
  }
  .commons-border {
    border-left: 1px solid #71302B; 
    border-right: 1px solid #71302B;
  }
  .bottom-border {
    border-bottom: 1px solid #71302B;
  }
  .top-border {
    border-top: 1px solid #71302B;
  }
  .borderstudio {
    border: 1px solid rgba(128, 128, 128, 0.35); 
  }

  .orbit-icon-container {
    position: relative;
    display: inline-block;
  }

  .orbit-icon {
    position: relative;
    z-index: 2;
    height:100%;
  }

  .the-scroll {
    overflow: auto;
  }
  .my-grid-container {
    display: grid;
    border-radius: 2px;
    width: auto;
    min-height: 100vh;
    grid-gap: 0;
  }

  .my-grid-container div {
    width: 100%;
    height:100%;
    flex: 1 0 auto;
  }

  .grid-cell {
    border: 0px solid #ccc;
    position: relative;
  }

    /* Display the letter on top of the cell */

.top-row-offset::before {
    content: attr(data-letter); 
    position: absolute;
    left: 0;
    top: -2rem;
    transform: translateX(100%);
    font-size: 1.25rem;
line-height: 1.75rem;
  }

.first-col-offset::after {
    content: attr(data-number); 
    position: absolute;
    left: -1.5rem;
    top: 0;
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .my-grid-container-wrapper {

    z-index: 50;
  }

  .artefact-overlay {
    width: stretch;
    top: 0.5rem;
    z-index: 5;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    background-color: rgba(255, 255, 255, 1);
  }
  .studio-grid {
    grid-gap: 2px;
  }
</style>
