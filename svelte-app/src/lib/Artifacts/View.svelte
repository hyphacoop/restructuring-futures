<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import GetAttachment from "../GetAttachment.svelte";
    import Reply from "../Reply.svelte";

    export let selectedDocument;
    export let attachment = true;
    export let reply = true;

    let artifactTitle;
    
    $: {
        if(selectedDocument){
            if (selectedDocument.text.includes('#Title:') && selectedDocument.text.includes('#Notes:')) {
                artifactTitle = selectedDocument.text.split("#Title:")[1].split("#Notes:")[0].trim();
            } else if (selectedDocument.text.includes('#Title:') && !selectedDocument.text.includes('#Notes:')) {
                // If only '#Title:' is present, take the whole text after '#Title:' as the title
                artifactTitle = selectedDocument.text.split("#Title:")[1].trim();
            } else {
                // Handle the scenario when '#Title:' or '#Notes:' are not present
                // This could be setting artifactTitle to some default value or empty string
                artifactTitle = '';
            }
        }
    }

    function close() {
        dispatch("close");
    }



    $: console.log('selectedDocument in ArtifactView', selectedDocument);
</script>
<div class='w-full ml-12 mr-8'>
    {#if artifactTitle}
    <div class='text-left'>
        <h4 class="mt-12 p-2">{artifactTitle}</h4>
    </div>
    {/if}

    <div class='flex flex-row justify-between w-full'>
    {#if attachment}
        <div class='attachmentbox'>
            <GetAttachment doc={selectedDocument} replies='false' />
        </div>
    {/if}
    {#if reply}
    <div class="mr-12">
        <Reply doc={selectedDocument} />
    </div>
    {/if}
    </div>
</div>
<button class='top-right' on:click={close}>close</button>

<style>
    .top-right {
        position: absolute;
        top:10px;
        right: 20px;
    }
    .attachmentbox {
        width:70%;
        height:100%;
    }
</style>
