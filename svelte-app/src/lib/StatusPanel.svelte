<script>
import shareKeypair from "../store/share";
import settings from "../store/settings";

export let status = undefined;

let getDocStatus, attachments, sent, received, requested, showattachments = false;
let shareAlias;


// Subscribe to shareKeypair
let shareID;

shareKeypair.subscribe($share => {
    shareID = $share.shareAddress;
    shareAlias = shareID.slice(0, 8);
});


// Update status-related variables reactively when status changes
$: if (status && status[shareID]) {
    getDocStatus = status[shareID].docs;
    attachments = status[shareID].attachments;
    sent = getDocStatus.sentCount;
    received = getDocStatus.receivedCount;
    requested = getDocStatus.requestedCount;
    showattachments = attachments && attachments.length > 0;
}

</script>

<div class='flex flex-col mt-8 px-8 border-2 p-4'>
    <div class='flex flex-col items-left'>
      <h4 class="mb-6">Status Panel & Current Share Details</h4>
      <p><b>Address:</b> {$shareKeypair.shareAddress} </p>
      <p> <b>Secret:</b> {$shareKeypair.secret}</p>
     
    </div>
    {#if settings.servers.length > 0}
    <div>
      <p><b> {settings.servers.length === 1 ? 'Server:' : `${settings.servers.length} Servers:`}</b></p>
      <ul>
        {#each settings.servers as server, i (i)}
          <li>{server}</li>
        {/each}
      </ul>
    </div>
  {/if}
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