<script>
    import replica from "../store/replica";
    import SvelteMarkdown from "svelte-markdown";
    import { ValidationError } from "earthstar";
    // import PdfViewer from 'svelte-pdf';

    export let doc;
    let attachmentBytes;
    let promise;
    let attachmentStatus = false;
    let dnone = true;
    let filetype;
    let mimetype;
    let isVisible = true;
    let buttonText = 'Hide attachment';

    $: buttonText = dnone ? 'Show attachment' : 'Hide attachment';

    async function getAttachment(doc) {
        const attachment = await $replica.replica.getAttachment(doc);
        let fileExtension = doc.path.split('.').pop();

        if (attachment !== undefined) {

            const docdata = await attachment.bytes();
            console.log("docdata", docdata);

            let bytes = new Uint8Array(docdata.length);
            for (var i = 0; i < docdata.length; i++) {
                bytes[i] = docdata[i];
            }

            if (fileExtension === "md") {
                filetype = "markdown";
                filetype = filetype;
                attachmentBytes = String.fromCharCode(...bytes);
            } else if (fileExtension == "mp3" || (fileExtension == "ogg" || fileExtension == "webm")) {
                filetype = "audio";
                mimetype = "audio/" + fileExtension;
                filetype = filetype;
                mimetype = mimetype;
                console.log("this is audio");
                console.log(filetype, mimetype);
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: mimetype })
                );
            } else if (fileExtension === "txt") {
                filetype = "text";
                filetype = filetype;
                console.log(filetype);
                //attachmentBytes = String.fromCharCode(...bytes);
                var decoder = new TextDecoder("utf-8");
                attachmentBytes = decoder.decode(Uint8Array.from(bytes));
            } else if (fileExtension == "png" || (fileExtension == "gif" || fileExtension == "jpeg")) {
                filetype = "image";

                console.log("this is an image");
                console.log("fileExtension " + fileExtension);

                mimetype = "image/" + fileExtension;
                filetype = filetype;
                mimetype = mimetype;

                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: mimetype })
                );
            } else {
                filetype = "other";
                filetype = filetype;
                console.log(filetype);
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: "application/octet-stream" })
                );
            }
            return attachmentBytes;
        }
    }

    function handleClick(doc) {
        promise = getAttachment(doc);
        attachmentStatus = true;
        dnone = false;
    }

    function Download() {
        let element = document.createElement("a");
        console.log(attachmentBytes + "attachmentBytes");
        if (attachmentBytes.split(":")[0] !== "blob") {
            console.log("attachmentBytes is a string");
            attachmentBytes = URL.createObjectURL(new Blob([attachmentBytes]));
            console.log("attachmentBytes is now a blob");
        }
        console.log("type of attachmentBytes ", typeof attachmentBytes);
        let file = attachmentBytes;
        let filename = doc.path.split("/")[doc.path.split("/").length - 1];
        console.log("type of file", typeof file);
        element.href = file;
        element.download = filename.slice(1);
        element.style.display = "none";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    $: {
    if (doc) {
        promise = getAttachment(doc);
        attachmentStatus = true;
        dnone = false;
        }
    }

    $: console.log("selectedDoc in GetAttachment", doc);
</script>
<!--
<button on:click={() => (isVisible = !isVisible)}>
    {isVisible ? "📎Attachment" : "📎Attachment"}
</button>
-->
{#if isVisible}
    {#await promise}
        Loading attachment...
    {:then data}
        {#if !dnone}
            <div class='flex flex-col justify-between h-auto'>
                <div class='my-12 w-full'>
                    {#if filetype == "image"}
                        <img src={data} alt={doc.text} />
                    {:else if filetype == "text"}
                        <p class='my-6 textbox'>
                            {@html data}
                        </p>
                    {:else if filetype == "audio"}
                        <audio class='w-full' src={data} controls />
                    {:else if filetype == "markdown"}
                        <div class="markdown">
                            <SvelteMarkdown source={data} />
                        </div>
                    {:else if filetype == "pdf"}
                        <p>Pdf preview to come</p>
                    {:else}
                        <p>Attachment type not supported</p>
                    {/if}
                </div>
            </div>
        {/if}
            {#if attachmentBytes !== undefined}
            <div class='flex flex-row mb-4'>
                <p class='mx-4'>
                    {#if !attachmentStatus}
                        <button on:click={handleClick(doc)}> Get attachment </button>
                    {:else}
                        <button on:click={() => (dnone = !dnone)}>
                            {buttonText}
                        </button>
                    {/if}
                </p>
                <p class='mx-4'>
                    <button on:click={() => Download()}>
                        Download attachment
                    </button>
                </p>
            </div>
            {/if}
    {/await}
{/if}

<style>
    .textbox {
        width:100%;
        max-width:60vw;
    }
    img {
        max-height: 50vh;
        max-width: 60vw;
    }
    audio {
        border-radius: 0.5rem;
    }
    .markdown {
        max-height: 50vh;
        max-width: 60vw;
        overflow: scroll;
        text-align: left;
        background-color: #f5f5f5;
        padding: 0.5rem;
        color:black;
        overflow: auto;
    }
    button {
        width: max-content;
    }
</style>
