<script>
import shareKeypair from "../store/share";

export let status = undefined;

// takes from memory (store; the commons' share address)
let shareID = $shareKeypair.shareAddress;

// when the new status comes in after sync, update the status
let getDocStatus = status[shareID].docs;
let attachments = status[shareID].attachments;

// show attachments if there are any
let showattachments = false;

// get the counts
let sent = getDocStatus.sentCount;
let received = getDocStatus.receivedCount;
let requested = getDocStatus.requestedCount;
let shareAlias = shareID.slice(0, 8);

// update the status
$: status = status;

// if there are attachments, show the attachments section
$: if (attachments.length > 0) {
    showattachments = true;
}

</script>

<div>
    <div class='left-a'>
      <h2>Status Panel & Current Share Details</h2>
      <p><b>Address:</b> {$shareKeypair.shareAddress} </p>
      <p> <b>Secret:</b> {$shareKeypair.secret}</p>
    </div>
    {#if status !== undefined}
    <div class="flex">
        <div class="flex-col">
        <h2>
            Status: <strong>{getDocStatus.status}</strong>
        </h2>    
        <h3>
            Share <strong>{shareAlias}</strong>
        </h3>
    </div>
        <div class="flex-col left-a">
        <h4>
            Documents
        </h4>
        <p>
            <strong>{sent}</strong> documents sent
        </p>
        <p>
            <strong>{received}</strong> documents received
        </p>
        <p>
            <strong>{requested}</strong> documents requested 
        </p>
        </div>
    </div>
        {#if showattachments}
        
                <h4 class='left-a'>
                    {attachments.length} Attachments
                </h4>
                <div class="flex">
            {#each attachments as attachment (attachment.hash)}
                    <div>
                        <h5>
                            <span class="kind">
                            {attachment.kind} 
                            </span>
                            <strong>
                                {attachment.status}
                            </strong>
                        </h5>
                        <p>
                            Bytes loaded: <strong>{attachment.bytesLoaded}</strong>
                        </p>
                        <p>
                            Total bytes: <strong>{attachment.totalBytes}</strong>
                        </p>
                        <p>
                            Author: <strong>{attachment.author.slice(0,9)}...</strong>
                        </p>
                    </div>
                
                {/each}
            </div>

        {/if}
    {/if}

</div>
<style>
    .left-a {
        text-align: left;
    }
    span.kind {
        text-transform: capitalize;
    }
    .flex {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>