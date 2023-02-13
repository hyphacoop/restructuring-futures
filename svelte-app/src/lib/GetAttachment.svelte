<script>

    import replica from "../store/replica";
    import SvelteMarkdown from 'svelte-markdown';
    // import PdfViewer from 'svelte-pdf';

    let replicaDetails;

    replica.subscribe((r) => {
        replicaDetails = r;
    });

    export let doc;
    let attachmentBytes;
    let promise;
    let attachmentStatus = false;
    let dnone = true;
    let filetype = undefined;
    let mimetype;

    function uint8ToBase64(arr) {
        btoa(
            Array(arr.length)
                .fill('')
                .map((_, i) => String.fromCharCode(arr[i]))
                .join('')
        );
    }


    async function getAttachment(doc) {
        const attachment = await replicaDetails.replica.getAttachment(doc);
        if (attachment !== undefined) {
            const docdata = await attachment.bytes();
            console.log("docdata", docdata);
            let fileExtension = doc.path.split(".")[doc.path.split(".").length - 1]
            console.log("fileExtension", fileExtension)
            let bytes = new Uint8Array(docdata.length);
            for (var i = 0; i < docdata.length; i++) {
                bytes[i] = docdata[i];
            }
            console.log("bytes ", bytes);
            if (fileExtension === "docx") {
                filetype = "docx";
                attachmentBytes = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            }
            else if (fileExtension === ("mp3" || "wav") || ("webm") || ("ogg")) {
                filetype = "audio";
                mimetype = "audio/" + fileExtension;
                filetype = filetype;
                console.log(filetype);
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: mimetype })
                );
            }
            else if (fileExtension === "md") {
                filetype = "markdown";
                attachmentBytes = String.fromCharCode(...bytes);
            }
            else if (fileExtension === "pdf") {
                filetype = "pdf";
                attachmentBytes = uint8ToBase64(bytes);
            }
            else if (fileExtension === "txt") {
                filetype = "text";
                filetype = filetype;
                console.log(filetype);
                //attachmentBytes = String.fromCharCode(...bytes);
                var decoder = new TextDecoder('utf-8');
                attachmentBytes = decoder.decode(Uint8Array.from(bytes));
            // "Hello, ä¸­å½!"
                console.log('Bytes to string: ', attachmentBytes);

            } else if (fileExtension === ("png" || "jpg") || ("jpeg" || "gif")) {
                filetype = "image";
                mimetype = "image/" + fileExtension;
                filetype = filetype;
                console.log(filetype);
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: mimetype } /* (1) */)
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
        console.log(attachmentBytes + 'attachmentBytes');
        if (attachmentBytes.split(':')[0] !== 'blob') {
            console.log('attachmentBytes is a string')
            attachmentBytes = URL.createObjectURL(
                    new Blob([attachmentBytes])
                );
            console.log('attachmentBytes is now a blob')
        }
        console.log('type of attachmentBytes' , typeof attachmentBytes)
        let file = attachmentBytes;
        let filename = doc.path.split("/")[doc.path.split("/").length - 1];
        console.log('type of file' , typeof file)
        element.href = file;
        element.download = filename.slice(1);
        element.style.display = "none";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

$: console.log("type", filetype);
$: console.log(doc.path.split(".").length - 1);
</script>


<p>
Attachment type: {doc.path.split(".")[doc.path.split(".").length - 1]}
<br>
Attachment size: {doc.attachmentSize / 1000} kb
</p>
<p>
{#if !attachmentStatus}
    <button on:click={handleClick(doc)}>
        Get attachment
    </button>
{:else}
    <button on:click={() => (dnone = !dnone)}>
        {#if !dnone}
            Hide attachment
        {:else}
            Show attachment
        {/if}
    </button>
{/if}
</p>
{#await promise}
    Loading attachment...
{:then data} 
    {#if !dnone}
        {#if filetype === "image"}
            <img src={data} alt={doc.text} />
        {:else if filetype === "text"}
            <p>{data}</p>
        {:else if filetype === "audio"}
            <audio src={data} controls />
        {:else if filetype === "markdown"}
            <SvelteMarkdown source={data} />
        {:else if filetype === "pdf"}
            <p>Pdf preview to come</p>
        {:else}
            <p>This file is not supported.</p>
        {/if}
        <p>
        <button on:click={() => Download()}>
            Download attachment
        </button>
        </p>
    {:else}
    <img class="dnone" src={data} alt={doc.text} />
    {/if}
{/await}

<style>
    img {
        max-height: 80vh;
        max-width: 60vw;
    }
    .dnone {
        display: none;
    }
    audio {
        border-radius: 0.5rem;
    }
</style>