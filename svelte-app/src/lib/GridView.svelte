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

  import numberToLetter from "./utils/numberToLetter";
  import pathToXY from "./utils/pathToXY";

  const dispatch = createEventDispatcher();

  let currentShare = get(shareKeypair).shareAddress;

  shareKeypair.subscribe(value => {
    currentShare = value.shareAddress;
  });

  function backToCommons() {
  const shareAddress = '+commons.b7q4gt64yiefosdafnmhvtxz43akzk6gw54aesdahtf4kdgpbyeia';
  const secret = settings.shareSecrets[shareAddress]; // retrieve the secret
  shareKeypair.set({shareAddress, secret});
  switchShare(); // set both shareAddress and secret
  selectedDocument = null;
  imageView = true;
  readManual = false;
  dispatch('resetManual');
}

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

  export let showDetails = true;
  export let IDcreated = false;
  export let attachment = true;
  export let isReply = false;
  export let readManual = false;

  let grid = [6, 9];

  let sectionIndex = 0;

  let gridState = Array(grid[0]).fill().map(() => Array(grid[1]).fill(false));

  let documents = [];

  let replies = false;

  // multiply x 1000 to convert to microseconds
  let usTime = $time.getTime() * 1000;

  let isMobile = false;
  let observer;
  let currentColor = COLOR_CYCLE[0];

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
    console.log('if selectedDoc', selectedDocument)
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
    documents = documents.filter((doc) => doc.path.split("/").length <= 6);
    console.log("Docs", documents);
    gridState = calculateLunarPhase(documents);
    console.log('gridState', gridState);

    const counts = countArtefactsInEachPhase(gridState);
    artefactsInPhase0 = counts.artefactsInPhase0;
    artefactsInPhase1 = counts.artefactsInPhase1;
    artefactsInPhase2 = counts.artefactsInPhase2;
    artefactsInPhase3 = counts.artefactsInPhase3;
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
    setTimeout(() => {
      fetchDocs();
    }, 500);
  });

  $: {
    if (documents.length === 0) {
      setTimeout(() => {
        fetchDocs();
      }, 2000);
    }
  }

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

  function switchShare() {
    documents = [];
    currentShare = get(shareKeypair).shareAddress;
    setTimeout(() => {
      fetchDocs();
    }, 500);
  }

$: if (readManual){
    currentShare = get(shareKeypair).shareAddress;
    if (currentShare.includes('commons')) {
      const shareAddress = '+studio.bywytquv2ypa7qqwtj3gbuel5fnqh6w5n5yecdqbwzsr4keativ3a';
      const secret = settings.shareSecrets[shareAddress]; // retrieve the secret
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
    }, 1000);
    readManual = false;
    dispatch('resetManual');
};

$: {
  sharePart = currentShare.split('+')[1].split('.')[0];
  isCommons = sharePart.includes('commons');
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

</script>

<div
  class="w-screen flex flex-row justify-start h-auto"
  on:click={() => (selectedDocument = null)}
  on:keydown={handleKeydown}
>
  {#if IDcreated}

    <!-- I created some utility function to delete and download the database -->
    <!--
    <DownloadTool />

    <DeleteTool />
        -->
  {/if}
</div>
<div class="the-scroll flex flex-row sm:flex-col min-h-screen overflow-y-auto">
  <div class='sm:w-1/5 flex flex-col side-bar fixed '>
  <button class="ml-6 mt-4 mb-2 h-auto mr-1 border-black" on:click={toggleDetails}>
    🔮 server customization
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
    <DocDetails doc={selectedDocument} {attachment} {isReply} />
  </div>
{:else}
<div>
  <h6 class='text-left'>{sharePart} status</h6>
  <p class="text-left text-xl font-bold mb-2">
    {selectedDocument
      ? `${scaledY}, ${scaledX} `
      : ""}
  </p>
  <div class="text-left font-bold mb-2 truncate ...">
  Share Address:<br>
  {currentShare}

  </div>
  <div class="text-left font-bold mb-2 truncate ...">
    Currrent {settings.servers.length === 1
      ? "Server:"
      : `${settings.servers.length} Servers:`}<br>
    <ServerList />
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
  {#if isCommons && sectionIndex === 0 || !isCommons}
  <div class='w-full flex flex-col py-4'>
    <button on:click={handleClick}>
      
      {#if imageView}
        Place an artefact
      {:else}
        Back to viewing
      {/if}
    </button>
  </div>
  {/if}
</div>
{/if}
  
    </div>
  </div>
  <div class="w-full sm:w-[80vw] mt-16 sm:mt-10 sm:ml-[20vw]">
    <div class="my-grid-container-wrapper pl-4 ml-4">
      {#if selectedDocument}
        <div class="artefact-overlay -ml-8 mt-[12vh] h-[80vh] w-[76vw] fixed items-stretch borderstudio">
          <View {selectedDocument} on:close={() => (selectedDocument = null)} />
        </div>
      {:else if !imageView}
        <div class="relative pl-6" style="z-index:51;">
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
            <h3 class="p-6">Looking for artefacts</h3>
          </div>
        {:else}
        {#if isCommons}
          {#each LUNAR_PHASE as phase, k (k)}
            <div
              id={`section${k}`}
              class="my-grid-container w-screen h-full"
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
                    {j === 0 && i === 0 && k === 0 ? 'first-cell-offset' : ''} 
                    {i === 0 && j !== 0 && k === 0 ? 'top-row-offset' : ''} 
                    {j === 0 && !(i === 0 && j === 0 && k === 0) ? 'first-col-offset' : ''}">
                      {#if i === 0}
                      <p class='text-left text-xl'>
                        {numberToLetter(j)}
                      </p>
                        {#if j === 0}
                        <p class='text-left text-xl'>
                        {i + 1}
                      </p>
                      {/if}
                      {:else if j === 0}
                       <p class='text-left text-xl'>
                        {i + 1}
                      </p>
                      {/if}
                      {#if documents.find((doc) => parseInt(doc.path.split("/")[2]) == i && parseInt(doc.path.split("/")[3]) == j)}
                        {#each documents.filter((doc) => parseInt(doc.path.split("/")[2]) == i && parseInt(doc.path.split("/")[3]) == j) as doc (doc.textHash + doc.timestamp)}
                          <div id={doc.textHash + doc.timestamp} class='orbit-icon-container'>

    
                            {#if (usTime < doc.deleteAfter - phase && usTime > doc.deleteAfter - (phase + 639360000000)) == false}

                            <OrbitingReplies {doc} disabled={true} />  
                              <div class="orbit-icon">  
                                <Icon {replies} phase={doc.lunarPhase}  {doc} disabled={true} />
                              </div>
                            {:else}
                            <OrbitingReplies {doc} />
                              <div class="orbit-icon">
                                <Icon {replies} phase={doc.lunarPhase}  {doc} on:click={() => selectDocument(doc)} />
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
          <div
          id={`Studio`}
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
                <div class="borderstudio">
                  {#if i === 0}
                  <p class='text-xl absolute ml-20'>
                    {numberToLetter(j)}
                  </p>
                    {#if j === 0}
                    <p class='text-left text-xl absolute'>
                    {i + 1}
                  </p>
                  {/if}
                  {:else if j === 0}
                   <p class='text-left text-xl'>
                    {i + 1}
                  </p>
                  {/if}
                  {#if documents.find((doc) => parseInt(doc.path.split("/")[2]) == i && parseInt(doc.path.split("/")[3]) == j)}
                    {#each documents.filter((doc) => parseInt(doc.path.split("/")[2]) == i && parseInt(doc.path.split("/")[3]) == j) as doc (doc.textHash + doc.timestamp)}
                      <div id={doc.textHash + doc.timestamp} class='orbit-icon-container'>
                          <OrbitingReplies {doc} />
                          <div class="orbit-icon">
                            <Icon {replies} phase=1 
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
        </div>
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
    width: 80vw;
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
  }
  .first-cell-offset {
    box-shadow: 1.5rem 2rem 0px 0px #fff inset;
  }
  .top-row-offset {
    box-shadow: 0px 2rem 0px 0px #fff inset;
  }
  .first-col-offset {
    box-shadow: 1.5rem 0px 0px 0px #fff inset;
  }
  .my-grid-container-wrapper {
    position: relative;
    z-index: 50;
  }

  .artefact-overlay {
    top: 0.5rem;
    left: 21vw;
    z-index: 5;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    background-color: rgba(255, 255, 255, 1);
    margin-left: 2px;
  }
  .studio-grid {
    grid-gap: 2px;
  }
</style>
