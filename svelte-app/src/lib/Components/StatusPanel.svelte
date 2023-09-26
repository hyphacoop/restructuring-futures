<script>
import { statusStore } from '../../store/status.js';

export let shareID;
//console.log('shareID', shareID);
let getDocStatus, sent, received, requested, funStatus;



// Update status-related variables reactively when status changes
$: {
    //console.log('statusStore', $statusStore);
if ($statusStore && $statusStore[shareID]) {
    let shareData = $statusStore[shareID];
    //console.log('shareData', shareData);
    if (shareData) {
        getDocStatus = shareData.docs
        //console.log('getDocStatus', getDocStatus)
        funStatus = getDocStatus.status;
        sent = getDocStatus.sentCount;
        received = getDocStatus.receivedCount;
        requested = getDocStatus.requestedCount;
    }
}
}


</script>

    {#if {$statusStore}}
    <div class="flex flex-col items-start">

 
        <h5>
           {funStatus}
        </h5>
        <p>
            <strong>{sent}</strong> {sent <= 1 ? 'document' : 'documents'} shared 
        </p>
        <p>
            <strong>{received}</strong> {received <= 1 ? 'document' : 'documents'} received 
        </p>
        <p>
            <strong>{requested}</strong> {requested <= 1 ? 'document' : 'documents'} in queue
        </p>

      </div>
    {/if}
   