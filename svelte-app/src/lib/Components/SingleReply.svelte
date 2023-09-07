<script>
    import { text } from "svelte/internal";
import GetAttachment from "../GetAttachment.svelte";

    export let doc;

    export let attachment = true;
    export let expanded = false;
    export let title = undefined;
    export let isReply = true;

    let deletionTime = undefined;
    let timestampInMilliseconds = new Date(doc.timestamp / 1000);
    let readableTimestamp = undefined;

    if (timestampInMilliseconds !== undefined) {
        console.log("timestampInMilliseconds", timestampInMilliseconds)
        readableTimestamp = new Intl.DateTimeFormat('en-US').format(timestampInMilliseconds);
    }


    if (doc.deleteAfter){
        let deletionTime = doc.deleteAfter;
    }


    let extended = false;
    let content = undefined;
    let dateTime = undefined;
    let textContent = undefined;


    $: if (title !== undefined && title.includes("<br>")) {

        content = title.split("<br>");
        let splitContent = content[1].split('Shared ');

        dateTime = splitContent[1].split(','); 

        title = content.shift();

        title = title + dateTime[0];
        extended = true;

    } else if (title !== undefined && !title.includes("voice")) {

        content = doc.text;

        let aliasReplied = content.split(': ');

        title = aliasReplied[0] + ' on ' + readableTimestamp;
        textContent = aliasReplied[1];

    }


</script>

    <div class='flex flex-col items-start' 
        class:replies="{isReply === true}"
        >

   
            
                {#if title !== undefined}
                <div class='flex flex-col w-full items-start'>
                    {@html title}
                    {#if textContent !== undefined}
                        <p class='text-2xl w-11/12 text-left {expanded ? '' : 'truncate ...'}'>{textContent}</p>
                    {/if}
                </div>
                    {#if attachment}
                    <div>
                        <GetAttachment {doc} replies={isReply}/>
                    </div>
                    {/if}
            
           
                {/if}

       

    </div>
<style>
    * {
        word-break: break-word;
    }
    p {
        margin: 0;
        padding:0.25rem;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background: #FFF;
    }

</style>
