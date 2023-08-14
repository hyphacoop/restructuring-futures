<script>
    import * as Earthstar from "earthstar";
    import { ReplicaDriverWeb } from "earthstar/browser";

    import { onMount } from "svelte";

    import GridSelector from "./GridSelector.svelte";
    import settings from "../../store/settings";
    import { studioShares } from '../../store/settings'; // Adjust path accordingly
    import authorKeypair from "../../store/identity";
    import replica from "../../store/replica";

    import splitTitleAndNotes from "../utils/splitTitleandNote";

    

    export let windowWidth;
    let xy = [];
    let showGrid = false;
    let showArtefacts = true;
    let studioReplica;
    let textContent;

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
            
            const everything = await studioReplica.getAllDocs();
            console.log('everything', everything);
            
            let results = await studioReplica.queryDocs({
                historyMode: "latest",
                filter: {
                    author: $authorKeypair.address,
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

    async function placeArtefact() {
        if (!selectedArtefact) {
            console.error("No artefact selected");
            return;
        }

        const attachmentBytes = await getAttachment(selectedArtefact);
        
        let date = new Date();
        let alias = $authorKeypair.address.slice(1, 5);
        let basePath = `/documents/${xy[0]}/${xy[1]}/${date.getTime()}/!shared-from-the-studio-by-${alias}`;
        let docPath = attachmentBytes ? `${basePath}.md` : basePath;

        let deletionTime = (Date.now() + 2548800000) * 1000;

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
        if (Earthstar.isErr(result)) {
            console.error(result);
        }
    }
</script>





    


    {#if showArtefacts}
<div style="position: fixed; z-index: 52;" class="mt-12 pt-2">
    <div class="container">
    <h5 class='ml-8 mt-8 text-left'>Place Artefact from the Studio</h5>
    <ul>
        {#each allArtefactsFromStudios as artefact (`${artefact.textHash}-${artefact.timestamp}`)} <!-- Assuming each artefact has an id for key -->
            <li>
                <button on:click={() => handleSelectArtefact(artefact)}>
                    {getTitle(artefact.text) ? `${getTitle(artefact.text)} - ${artefact.path}` : artefact.path}
                </button>
                <!-- Displaying the title if available followed by the path. You can adjust this accordingly. -->
            </li>
        {/each}
    </ul>
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