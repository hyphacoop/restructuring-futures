<script>
    import replicaDetails from "../../store/replica";
    import SvelteMarkdown from "svelte-markdown";
    import PdfViewer from 'svelte-pdf';
    import { onMount } from "svelte";

    import { getAttachment, getFileExt } from "../utils/attachmentHelper";

    export let doc;
    export let studioReplica;

    let promise;
    let attachmentStatus = false;
    let dnone = true;
    let filetype;

    async function getAttachmentObject(doc) {

        let bytes = await getAttachment(doc, studioReplica);

        console.log('filetype preview', filetype);

        return bytes;
    }

    filetype = getFileExt(doc);

    $: {
    if (doc) {
        filetype = getFileExt(doc);
        promise = getAttachmentObject(doc);
        attachmentStatus = true;
        dnone = false;
        console.log(promise)
        }
    }

</script>

{#if attachmentStatus}

    {#await promise}
        Loading attachment...
    {:then data}
        {#if !dnone}
            <div class='flex flex-row flex-wrap justify-center w-full'>
                <div class='flex flex-col items-center h-auto'>

                        {#if filetype == "image"}
                            <img src={data} alt={doc.text} class="mx-auto" />
                        {:else if filetype == "text"}
                            <p class='my-6 textbox'>
                                {@html data}
                            </p>
                        {:else if filetype == "audio"}
                        <div class='audioWrapper'>
                            <audio class='w-full' src={data} controls />
                        </div>
                        {:else if filetype == "markdown"}
                            <div class="markdown text-3xl self-end">
                                <SvelteMarkdown source={data} />
                            </div>
                        {:else if filetype == "pdf"}
                        <div class="pdfViewer">
                            <PdfViewer {data} url={data} showButtons={["navigation", "pageInfo"]} showBorder={false} />
                        </div>
                        {:else}
                            {filetype}
                            <p>Attachment type not supported. You can use the <i>report bugs</i> link in the footer to request a new filetype feature.</p>
                        {/if}
                </div>
            </div>
        {/if}
    {/await}
{/if}

<style>
    .textbox {
        width:100%;
        max-width:200px;
        max-height: 200px;
        overflow: scroll;
    }
    img {
        height: 200px;
        width: 200px;
        object-fit: contain;
    }
    audio {
        border-radius: 0.5rem;
    }
    .markdown {
        max-height: 200px;
        max-width: 200px;
        overflow: scroll;
        text-align: left;
        background-color: #ffffff;
        padding: 0.5rem;
        color:black;
        overflow: auto;
    }
    .pdfViewer {
        max-width: 200px;
        max-height: 200px;
        overflow: auto;
    }
    .audioWrapper {
        width: 200px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
