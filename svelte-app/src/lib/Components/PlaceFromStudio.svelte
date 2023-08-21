<script>
    import * as Earthstar from "earthstar";
    import { ReplicaDriverWeb } from "earthstar/browser";

    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";

    import GridSelector from "./GridSelector.svelte";
    import settings from "../../store/settings";
    import { studioShares } from '../../store/settings'; // Adjust path accordingly
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

    $: {
        console.log('studioShares', studioShares);
        console.log('showGrid', showGrid);
        console.log('showArtefacts', showArtefacts);
    }

    // Use the value of studioShares
    let sharesValue;
    studioShares.subscribe(value => {
        sharesValue = value;
    });

    console.log('sharesValue', sharesValue)

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
        const fetchArtefactsFromShare = async (share) => {
            try {
            console.log('processing share', share);
            const shareSecret = settings.shareSecrets[share];
            console.log('shareSecret', shareSecret)
            studioReplica = new Earthstar.Replica({
                driver: new ReplicaDriverWeb(share),
            });
            console.log('authorKeypair address', $authorKeypair.address)
            
            let results = await studioReplica.queryDocs({
                historyMode: "latest",
                filter: {
                    author: $authorKeypair.address,
                    pathStartsWith: "/documents",
                },
                limit: 10,
            });
            console.log("Results for share:", share, results);
            results = results.filter((doc) => doc.path.split("/").length <= 6);
            console.log("Filtered results:", results);
            return results;
            
        } 
         catch (error) {
    console.error("Error fetching artefacts:", error);
}
        }




        let promises = sharesValue.map(share => fetchArtefactsFromShare(share));

        let results = await Promise.all(promises);
        console.log('results', results)
        allArtefactsFromStudios = results.flat();
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
     const attachment = await studioReplica.getAttachment(doc);
     if (attachment && typeof attachment.bytes === 'function') {
         return await attachment.bytes();
     }
     return null;
 }

 const fetchReplies = async (basePath) => {
    console.log('basePath', basePath)
    const allDocs = await studioReplica.queryDocs({
        filter: {
            pathStartsWith: basePath,
        },
    });
        
    // Filter out documents by path length and empty or whitespace-only text content
    let onlyReplies = allDocs.filter((doc) => {
        return doc.path.split("/").length >= 7 && doc.text.trim() !== "";
    });
    console.log('ALL REPLIES: ', onlyReplies)
    return onlyReplies;
};

const placeReplies = async (docs, basePath, deletionTime) => {
    for (let doc of docs) {
        let date = new Date();
        let filename = doc.path.split('/').pop();
        console.log('filename', filename);
        console.log('received doc attempt:', doc);
        if (filename.includes('.')) {
            const attachmentBytes = await getAttachment(doc);
            if (attachmentBytes) {
                doc.attachment = attachmentBytes;
            }
        }
        console.log('basePath', basePath);
        let tempPath = basePath.split('!')[0];
        let newPath = tempPath + `${date.getTime()}/!` + filename;
        let reply = {
            path: newPath,
            deleteAfter: deletionTime,
            text: doc.text
        } 
        console.log('reply to validate path', reply)
        console.log('upload doc attempt:', doc);
        const result = await $replica.replica.set($authorKeypair, reply);
        console.log('replies result:', result);

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
        console.log('pathForReplies', pathForReplies);
        let replies = await fetchReplies(pathForReplies);

        // Place them in the commons
        let transferedReplies = await placeReplies(replies, newPath, deletionTime);
        if (Earthstar.isErr(result)) {
            console.error(result);
        }
    }
</script>

    {#if showArtefacts}
<div style="position: absolute; z-index: 52;" class="mt-16 pt-4">
    <div class="container">
    <h4 class='ml-8 mt-8 text-left'>Place Artefact from the Studio</h4>
    {#if allArtefactsFromStudios.length === 0}
        <h5 class='ml-8 mt-8 text-left'>no artefacts found in the studio</h5>
        <StudioPortal noArtefacts={true} on:shareUpdated={hideWindow}/>
    {:else}
   <div  class='flex flex-row flex-wrap mx-2 justify-center '>
        {#each allArtefactsFromStudios as artefact (`${artefact.textHash}-${artefact.timestamp}`)} <!-- Assuming each artefact has an id for key -->
            <div class='m-1 flex flex-col'>

                <button on:click={() => handleSelectArtefact(artefact)}>

                    <ArtefactPreview doc={artefact} {studioReplica} />
                    {getTitle(artefact.text) ? `${getTitle(artefact.text)} - Shared on ${extractDateFromPath(artefact.path)}` : artefact.path}
                </button>
                <!-- Displaying the title if available followed by the path. You can adjust this accordingly. -->
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
  }

</style>