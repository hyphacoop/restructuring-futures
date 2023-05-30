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

<div class='flex flex-col mt-8 px-8'>
    <div class='flex flex-col items-center'>
      <h4 class="mb-6">Status Panel & Current Share Details</h4>
      <p><b>Address:</b> {$shareKeypair.shareAddress} </p>
      <p> <b>Secret:</b> {$shareKeypair.secret}</p>
    </div>
    {#if status !== undefined}
    <div class="flex flex-col">
        <div class="flex-col py-4">
        <h4>
            Status: <strong>{getDocStatus.status}</strong>
        </h4>    
        <h4>
            Share <strong>{shareAlias}</strong>
        </h4>
    </div>
        <div class="flex-col items-center py-4">
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
        
                <h4 class="py-4">
                    {attachments.length} {attachments > 1 ? 'Attachments' : 'Attachment' }
                </h4>
                <div class="flex flex-col py-4 h-50vh overflow-y-scroll">
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

    span.kind {
        text-transform: capitalize;
    }

    p { 
        max-width: unset;
    }
    .h-50vh {
        height: 45vh;
    }
</style>