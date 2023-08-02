<script>
    import replica from "../store/replica";
    import authorKeypair from "../store/identity";
    import cacheDetails from "../store/cache";
    import replicaDetails from "../store/replica";
    import shareKeypair from "../store/share";
    import settings from "../store/settings";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    import JSZip from "jszip";

    let documents = [];
    let paths = [];
    let archive = [];
    let counter;
    let previousShare;
    let selectedShare;
    let isHidden = true;

    export let shareAddress;
    export let isStudio = false;

   
    shareKeypair.subscribe(value => {
    selectedShare = value.shareAddress;
    });

    const fetchCounter = async () => {
        console.log('fetching counter')
        let counterDocs = await $cacheDetails.queryDocs({
            filter: {
                pathStartsWith: "/counter",
            },
        });

        if (counterDocs.length > 0) {
            counter = counterDocs[0].text;
        } else {
            counter = "0";
        }
    };


    
    const incrementCounter = async () => {
        await fetchCounter();
        let count = counter;
        let counterValue = count ? count : "0";
        let counterNumber = parseInt(counterValue);
        let newCounterNumber = counterNumber + 1;
        let newCounterValue = newCounterNumber.toString();
        let result = await $replica.replica.set($authorKeypair, {
            path: "/counter/number",
            text: newCounterValue,
        });
        console.log('new count', result);
        counter = newCounterValue;
    };
  
    const fetchDocs = async () => {
       

        documents = await $cacheDetails.queryDocs({
            filter: {
                pathStartsWith: "/documents",
            },
        });

        // Log the documents
        console.log('docs to archive', documents)

        // Extract paths from documents and store in paths array
        paths = documents.map((doc) => doc.path);

    };

    const fetchAttachments = async (zip) => {
        for (let doc of documents) {
            let folder = zip.folder(doc.path.replace("/", "_")); // Replace / with _ in the path to create a valid folder name
            folder.file("document.txt", JSON.stringify(doc)); // Add document content to a text file in the folder

            if (doc.attachmentSize) {
                // If the doc has an attachment
                let attachment = await $replica.replica.getAttachment(doc);
                let attachmentBytes = attachment
                    ? await attachment.bytes()
                    : undefined;

                // Extract filename from doc.path
                let filename = doc.path.split("/").pop().replace("!", "");

                // Add the attachment to a file in the folder
                // TODO: may need to convert attachmentBytes to a Blob or other appropriate format depending on the format of the attachment
                folder.file(filename, attachmentBytes);
            }
        }
    };

    const downloadArchive = async (zip) => {
        let content = await zip.generateAsync({ type: "blob" });
        let element = document.createElement("a");
        let date = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
        element.href = URL.createObjectURL(content);
        element.download = "archive_" + date + ".zip";
        element.style.display = "none";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    const createArchive = async () => {

        try {
            let zip = new JSZip();
            await fetchDocs();
            await fetchAttachments(zip);
            await downloadArchive(zip);
            await incrementCounter();

        } catch (error) {
            console.error("Error during archival:", error);

            
        };
    };

    $:   if (shareAddress === selectedShare) {
        isHidden = false;
    }
    $: console.log('isStudio', isStudio);
</script>
{#if !isHidden}
    <div class="{!isStudio ? 'phase1' : ''} flex flex-col-reverse">
    <button on:click={createArchive}>{!isStudio ?  'Create Archive' : 'backup this studio'}</button>

        {#if counter > 0}
            <p class="text-left">
            This button was used {counter}
            {counter > 1 ? "times" : "time"}
            </p>
        {/if}

    </div>
{/if}
