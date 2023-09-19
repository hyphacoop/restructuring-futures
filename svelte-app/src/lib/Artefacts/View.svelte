<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import GetAttachment from "../GetAttachment.svelte";
    import Reply from "../Reply.svelte";

    export let selectedDocument;
    export let attachment = true;
    export let reply = true;

    let artefactTitle;
    
    $: {
        if(selectedDocument){
            if (selectedDocument.text.includes('#Title:') && selectedDocument.text.includes('#Notes:')) {
                artefactTitle = selectedDocument.text.split("#Title:")[1].split("#Notes:")[0].trim();
            } else if (selectedDocument.text.includes('#Title:') && !selectedDocument.text.includes('#Notes:')) {
                // If only '#Title:' is present, take the whole text after '#Title:' as the title
                artefactTitle = selectedDocument.text.split("#Title:")[1].trim();
            } else {
                // Handle the scenario when '#Title:' or '#Notes:' are not present
                // This could be setting artefactTitle to some default value or empty string
                artefactTitle = '';
            }
        }
    }

    function close() {
        dispatch("close");
    }

</script>
<div class='w-full h-full flex flex-col ml-4 mr-8 pr-4'>
    {#if artefactTitle}
    <div class='flex flex-row text-left w-full'>
        <h4 class="mt-4 p-2">{artefactTitle}</h4>
    </div>
    {/if}

    <div class='flex flex-row justify-between w-full h-4/5'>
    {#if attachment}
        <div class='attachmentbox pr-12 w-2/3 overflow-y-scroll'>
            <GetAttachment doc={selectedDocument} replies={false} />
        </div>
    {/if}
    {#if reply}
        <div class="ml-6 mr-2 pr-8n w-1/3">
            <Reply doc={selectedDocument} title={artefactTitle} />
        </div>
    {/if}
    </div>
</div>
<button style="text-decoration: underline;" class='top-right' on:click={close}>exit artefact</button>

<style>
    .top-right {
        position: absolute;
        top:10px;
        right: 20px;
        border: 0px solid black;
    }

</style>
