<script>
    export let doc;
    export let attachment = true;
    let showDetails = false;
</script>
<button on:click={() => (showDetails = !showDetails)}>
    📄
</button>
{#if showDetails}
    <div>
        <h4>{@html doc.text}</h4>
        <p>
            {#if attachment}
            Attachment type: {doc.path.split(".")[doc.path.split(".").length - 1]}
            <br />
            Attachment size: {doc.attachmentSize / 1000} kb
            {:else}
            author: {doc.author}
            format: {doc.format}
            share: {doc.share}
            share signature:{doc.shareSignature}
            doc signature: {doc.signature}
            textHash:{doc.textHash}
            timestamp: {doc.timestamp / 1000}
            {/if}
        </p>

    </div>
{/if}