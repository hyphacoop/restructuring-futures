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
            }  else {
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
{#if artifactTitle}
<h4 class="mt-12 p-2">{artifactTitle}</h4>
{/if}

<div class='flex flex-row justify-between w-full'>
{#if attachment}
    <div class='attachmentbox'>
        <GetAttachment doc={selectedDocument} replies='false' />
    </div>
{/if}
{#if reply}
<div class="mr-6">
    <Reply doc={selectedDocument} />
</div>
{/if}
</div>

<button class='top-right' on:click={close}>close</button>

<style>
    .top-right {
        position: absolute;
        top:10px;
        right: 10px;
    }
    .attachmentbox {
        width:70%;
        height:100%;
    }
</style>
