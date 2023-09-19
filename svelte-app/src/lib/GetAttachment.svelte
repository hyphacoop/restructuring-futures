<script>
    import replica from "../store/replica";
    import SvelteMarkdown from "svelte-markdown";
    import { ValidationError } from "earthstar";
    import PdfViewer from 'svelte-pdf';

    export let doc;
    export let replies = false;
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
        console.log('getting attachment')
        const attachment = await $replica.replica.getAttachment(doc);
        let fileExtension = doc.path.split('.').pop();

        if (attachment !== undefined) {
            console.log('attachment found')
            console.log('fileExtension', fileExtension);
            const docdata = await attachment.bytes();
            //console.log("docdata", docdata);

            let bytes = new Uint8Array(docdata.length);
            for (var i = 0; i < docdata.length; i++) {
                bytes[i] = docdata[i];
            }

            if (fileExtension === "md") {
                filetype = "markdown";
                var decoder = new TextDecoder("utf-8");
                attachmentBytes = decoder.decode(new Uint8Array(docdata));
            } else if (["mp3", "ogg", "webm"].includes(fileExtension)) {
                filetype = "audio";
                mimetype = "audio/" + fileExtension;
                console.log("this is audio");
                console.log(filetype, mimetype);
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: mimetype })
                );
            } else if (fileExtension === "txt") {
                filetype = "text";
                console.log(filetype);
                //attachmentBytes = String.fromCharCode(...bytes);
                var decoder = new TextDecoder("utf-8");
                attachmentBytes = decoder.decode(Uint8Array.from(bytes));
            } else if (["png", "gif", "jpeg"].includes(fileExtension)) {
                filetype = "image";

                console.log("this is an image");

                mimetype = "image/" + fileExtension;
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: mimetype })
                );
            } else if (fileExtension === "pdf") {
                filetype = "pdf";
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: "application/pdf" })
                );
            } else {
                filetype = "other";

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

</script>

{#if isVisible}
    {#await promise}
        Loading attachment...
    {:then data}
    <div class='flex flex-row {replies ? 'mr-4 pr-4 w-full' : 'mb-16 w-auto'} flex-wrap'>

        {#if !dnone}
            <div class='flex flex-col justify-between w-4/5 h-auto'>
                <div class='{replies === true ? '' : 'mt-4'}'>
                    {#if filetype == "image"}
                        <div class='w-auto h-auto'>
                            <img src={data} alt={doc.text} />
                        </div>
                    {:else if filetype == "text"}
                        <p class='my-6 textbox'>
                            {@html data}
                        </p>
                    {:else if filetype == "audio"}
                    <div class='w-full'>
                        <audio src={data} controls />
                    </div>
                    {:else if filetype == "markdown"}
                        <div class="markdown text-3xl w-auto">
                            <SvelteMarkdown source={data} />
                        </div>
                    {:else if filetype == "pdf"}
                    <div class="pdfViewer">
                        <PdfViewer url={data} showButtons={["navigation", "pageInfo"]} showBorder={false} />
                    </div>
                        {:else}
                        <p>Attachment type not supported</p>
                    {/if}
                </div>
            </div>
        {/if}
        {#if !attachmentStatus}
            {#if attachmentBytes !== undefined && replies !== 'true'}
            <div class='flex flex-row mb-4 items-end pb-8'>
                <p class='mx-4'>

                        <button on:click={handleClick(doc)}> Get attachment </button>
                  <!--   {:else}
                        <button on:click={() => (dnone = !dnone)}>
                            {buttonText}
                        </button> -->

                </p>
              <!--   <p class='mx-4'>
                    <button on:click={() => Download()}>
                        Download attachment
                    </button>
                </p> -->
            </div>
            {/if}
            {/if}
            </div>
    {/await}
{/if}

<style>
    .textbox {
        width:100%;
        max-width:60vw;
    }
    img {
        object-fit: contain;
        padding-left:1rem;
        max-height: 65vh;
        max-width: 100%;
    }
    audio {
        border-radius: 0.5rem;
        width:99%;
    }
    .markdown {
        overflow: scroll;
        text-align: left;
        background-color: #ffffff;
        padding: 0.5rem;
        color:black;
        overflow: auto;
        word-break: break-word;
    }
    button {
        width: max-content;
    }
    .pdfViewer {
        max-height: 50vh;
        max-width: 50vw;
        overflow-y: auto;
    }
</style>
