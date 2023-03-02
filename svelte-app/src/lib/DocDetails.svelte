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
        {#if !attachment}
        <ul>
            <li> author: {doc.author} </li>

                <li>share: {doc.share}</li>
                    <li>share signature:{doc.shareSignature}</li>
                        <li>doc signature: {doc.signature}</li>
                            <li>textHash:{doc.textHash}</li>
                                <li>timestamp: {doc.timestamp / 1000}</li>
        </ul>
        {:else if attachment}
            Attachment type: {doc.path.split(".")[doc.path.split(".").length - 1]}
            <br />
            Attachment size: {doc.attachmentSize / 1000} kb
        {/if}
 

    </div>
{/if}