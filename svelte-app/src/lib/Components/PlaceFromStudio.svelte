<script>
    import * as Earthstar from "earthstar";
    import { ReplicaDriverWeb } from "earthstar/browser";

    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";

    import GridSelector from "./GridSelector.svelte";
    import { studioShares } from '../../store/settings';
    import authorKeypair from "../../store/identity";
    import replica from "../../store/replica";

    import splitTitleAndNotes from "../utils/splitTitleandNote";
    import StudioPortal from "./StudioPortal.svelte";
    import ArtefactPreview from "./ArtefactPreview.svelte";

    import { extractDateFromPath } from "../utils/attachmentHelper";

    const dispatch = createEventDispatcher();

    export let windowWidth;
    let xy = [];
    let showGrid = false;
    let showArtefacts = true;
    let studioReplica;
    let deletionTime;

    let replicasByShare = {};

      // Function to initialize or update a replica for a given share address
      function initReplica(share) {
        if (!replicasByShare[share]) {
            console.log(`Creating new replica for share: ${share}`);
            replicasByShare[share] = new Earthstar.Replica({
                driver: new ReplicaDriverWeb(share)
            });
        }
    }

    // Use the value of studioShares
    let sharesValue;
    studioShares.subscribe(value => {
        sharesValue = value;
    });


    function handleSelection(event) {
        xy = event.detail;
        showGrid = false;
        placeArtefact();
    }

    function hideWindow() {
        showArtefacts = false;
        dispatch("hideWindow");
    }

    let allArtefactsFromStudios = [];

    onMount(async () => {
        studioShares.subscribe(values => {
            values.forEach(share => initReplica(share));
        });
    const fetchArtefactsFromShare = async (share) => {
        try {

            let results = await replicasByShare[share].queryDocs({
                historyMode: "latest",
                filter: {
                    author: $authorKeypair.address,
                    pathStartsWith: "/documents",
                }
            });

            results = results.filter(doc => {
                if (!doc.text.trim()) return false;
                if (/^\/documents\/page\d+\/newPage$/.test(doc.path)) return false;
                const segments = doc.path.split("/");
                return doc.path.includes('/page') ? segments.length <= 7 : segments.length <= 6;
            });

            return results;
        } catch (error) {
            console.error("Error fetching artefacts:", error);
            return []; // Return empty array to safely use flat later
        }
    }

    let shares = sharesValue || []; // Ensure sharesValue is defined and an array
    let promises = shares.map(share => fetchArtefactsFromShare(share));

    try {
        let results = await Promise.all(promises);
        allArtefactsFromStudios = results.flat();
        console.log("All artefacts from studios:", allArtefactsFromStudios);
    } catch (error) {
        console.error("Error handling all artefacts fetching:", error);
    }
});

    let selectedArtefact;

    function handleSelectArtefact(artefact) {
        selectedArtefact = artefact;
        showArtefacts = false; // Hide the artefacts
        showGrid = true;       // Show the grid for location selection
    }

    function getTitle(text) {
        const content = splitTitleAndNotes(text);
        return content.title;
    }

    async function getAttachment(doc) {
     const attachment = await replicasByShare[doc.share].getAttachment(doc);
     if (attachment && typeof attachment.bytes === 'function') {
        console.log("Attachment bytes: ", await attachment.bytes());
         return await attachment.bytes();
     }
     return null;
 }

 const fetchReplies = async (basePath, share) => {
    const allDocs = await replicasByShare[share].queryDocs({
        filter: {
            pathStartsWith: basePath,
        },
    });
        
    // Filter out documents by path length and empty or whitespace-only text content
    let onlyReplies = allDocs.filter((doc) => {
        // Check if the document text is non-empty
        if (doc.text.trim() === "") {
            return false;
        }
        // If the path contains '/page', allow path length of 8, otherwise, allow length of 7
        if (doc.path.includes('/page')) {
            return doc.path.split("/").length >= 8;
        } else {
            return doc.path.split("/").length >= 7;
        }
    });
    return onlyReplies;
};

const placeReplies = async (docs, basePath, deletionTime) => {
    for (let doc of docs) {
        let date = new Date();
        let filename = doc.path.split('/').pop();
        if (filename.includes('.')) {
            const attachmentBytes = await getAttachment(doc);
            if (attachmentBytes) {
                doc.attachment = attachmentBytes;
            }
        }
        let tempPath = basePath.split('!')[0];
        let newPath = tempPath + `${date.getTime()}/!` + filename;
        let reply = {
            path: newPath,
            deleteAfter: deletionTime,
            text: doc.text
        } 
        const result = await $replica.replica.set($authorKeypair, reply);

        if (Earthstar.isErr(result)) {
            console.error(result);
        }
    }
};

    async function placeArtefact() {
        if (!selectedArtefact) {
            console.error("No artefact selected");
            return;
        }

        const attachmentBytes = await getAttachment(selectedArtefact);
        let originalExtension = selectedArtefact.path.split(".").pop();
        
        let date = new Date();
        let alias = $authorKeypair.address.slice(1, 5);
        let newPath = `/documents/${xy[0]}/${xy[1]}/${date.getTime()}/!shared-from-the-studio-by-${alias}`;
        
        let docPath = attachmentBytes ? `${newPath}.${originalExtension}` : newPath + ".md";

        deletionTime = (Date.now() + 2548800000) * 1000;

        let thisDoc = {
            path: docPath,
            text: selectedArtefact.text,
            deleteAfter: deletionTime
        }

        if (attachmentBytes) {
            thisDoc.attachment = attachmentBytes;
        }

        let result = await $replica.replica.set($authorKeypair, thisDoc);
        console.log("Result: ", result);
        // Fetch all replies at the given path
        let pathForReplies = selectedArtefact.path.substring(0, selectedArtefact.path.lastIndexOf('/'));
        let replies = await fetchReplies(pathForReplies, selectedArtefact.share);

        // Place them in the commons
        let transferedReplies = await placeReplies(replies, newPath, deletionTime);
        dispatch("artefactPlaced");
        console.log("transferedReplies: ", transferedReplies);
        if (Earthstar.isErr(result)) {
            console.error(result);
        }
    }
</script>

    {#if showArtefacts}
<div style="position: fixed; z-index: 52;" class="mt-16 pt-4">
    <div class="container">
    <h4 class='ml-8 mt-8 text-left'>Place Artefact from the Studio</h4>
    {#if allArtefactsFromStudios.length === 0}
        <h5 class='ml-8 mt-8 text-left'>no artefacts found in the studio</h5>
        <StudioPortal noArtefacts={true} on:shareUpdated={hideWindow}/>
    {:else}
    <div class='flex flex-row flex-wrap mx-2 justify-center '>
        {#each allArtefactsFromStudios as artefact (`${artefact.textHash}-${artefact.timestamp}`)}
            <div class='m-1 flex flex-col w-64 h-64'> <!-- Assuming a fixed width of 16rem and height of 20rem as an example. Adjust accordingly. -->
                
                <button class='flex flex-col h-full justify-between' on:click={() => handleSelectArtefact(artefact)}> <!-- This makes the button flex and occupies full height -->
    
                    <div class='flex w-full'> <!-- This makes the preview occupy 80% of the height -->
                        <ArtefactPreview doc={artefact} studioReplica={replicasByShare[artefact.share]} />
                    </div>
                    
                    <div class="h-1/6 text-center flex items-center justify-center"> <!-- This makes the text occupy 20% of the height and centers the text -->
                        {getTitle(artefact.text) ? `${getTitle(artefact.text)} - Shared on ${extractDateFromPath(artefact.path)}` : artefact.path}
                    </div>
    
                </button>
            </div>
        {/each}
    </div>
    {/if}
</div>
</div>
    {:else if showGrid}
        <GridSelector bind:windowWidth on:selected={handleSelection} />
    {/if}   
<style>
  .container {
    position: relative;
    display: grid;
    border: 1px solid #999;
    border-radius: 2px;
    width: 78vw;
    height: 80vh;
    grid-gap: 1px;
    background: #ffffff;
    z-index: 98;
    overflow-y: auto;
  }

</style>