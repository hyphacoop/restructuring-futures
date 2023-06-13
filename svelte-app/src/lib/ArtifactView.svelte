<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import GetAttachment from "./GetAttachment.svelte";
    import Reply from "./Reply.svelte";

    export let selectedDocument;
    export let attachment = true;
    export let reply = true;
    export let inStudio = false;

    let artifactTitle;

    $: {
        if(selectedDocument){
            artifactTitle = selectedDocument.text.split("#Title:")[1].split("#Notes:")[0].trim();
        }
    }

    function close() {
        dispatch("close");
    }



    $: console.log('selectedDocument in ArtifactView', selectedDocument);
</script>
{#if artifactTitle}
<h4 class="mt-12">{artifactTitle}</h4>
{/if}

<div class='flex flex-row justify-between w-full'>
{#if attachment}
    <div class='attachmentbox'>
        <GetAttachment doc={selectedDocument} />
    </div>
{/if}
{#if reply}
<div>
    <Reply doc={selectedDocument} {inStudio}/>
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
