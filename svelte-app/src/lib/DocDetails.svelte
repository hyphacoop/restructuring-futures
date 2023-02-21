<script>
    export let doc;
    let showDetails = false;
</script>
<button on:click={() => (showDetails = !showDetails)}>
    📄
</button>
{#if showDetails}
    <div>
        <p>
            Attachment type: {doc.path.split(".")[doc.path.split(".").length - 1]}
            <br />
            Attachment size: {doc.attachmentSize / 1000} kb
        </p>
        <p>{@html doc.text}</p>
    </div>
{/if}