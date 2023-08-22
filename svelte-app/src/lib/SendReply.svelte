<script>
    import { createEventDispatcher } from "svelte";
    import { get } from "svelte/store";
    
    import replica from "../store/replica";
    import authorKeypair from "../store/identity";
    import shareKeypair from "../store/share";

    import Voice from "./Artefacts/Voice.svelte";

    const dispatch = createEventDispatcher();

    function isUnchanged(t) {
        return t == placeholder;
    }

    export let doc;

    let result;
    let txt = false;
    let voice = false;
    let text = "";
    let placeholder = "Type your reply here";
    let lgth = text.length;
    let sharePart;
    let isCommons;
    let thisDoc = {};
  
    let currentShare = get(shareKeypair).shareAddress;

    shareKeypair.subscribe(value => {
    currentShare = value.shareAddress;
    });


    $: {
    sharePart = currentShare.split('+')[1].split('.')[0];
    isCommons = sharePart.includes('commons');
    }

    async function sendReply() {
        let alias = $authorKeypair.address.slice(1, 5);
        let timestamp = Date.now();
        let oldPath = doc.path;
        console.log("oldPath", oldPath);

        let basePath;
        let ephemerality;

        if (isCommons) {
            // split by '!' for commons
            let splitPath = oldPath.split("!");
            basePath = splitPath[0];
            ephemerality = '!';
        } else {
            // use regex to split at timestamp for studio
            let match = oldPath.match(/(\/documents\/page?\d*\/\d+\/\d+)/);
            if (match && match[1]) {
                basePath = match[1];
            } else {
                throw new Error("Invalid path format for studio");
            }
            ephemerality = '';
        }
        let newPath;
        if (isCommons) {
            newPath = basePath + timestamp + "/" + ephemerality + "reply-by-" + alias;
            thisDoc.deleteAfter = doc.deleteAfter;
        } else {
            newPath = basePath + "/" + timestamp + "/reply-by-" + alias;
        }

        let docText = alias + " replied: " + text;
        thisDoc.text = docText;
        thisDoc.path = newPath;

        const result = await $replica.replica.set($authorKeypair, thisDoc);
        console.log('newPath', newPath);
        console.log("result ", result);
        dispatch("success");
        text = '';
        return result;
    }

    $: if (result !== undefined && result.kind == "success") {
        placeholder = "send another reply";
        text = "";
    }

    function txtReply() {
        txt = !txt;
        voice = false;
    }

    function voiceReply() {
        txt = false;
        voice = !voice;
    }


    $: if (text !== undefined) {
        lgth = text.length;
    }

    $: console.log('result', result);
</script>

<div>
    <div class='flex flex-row'>
        <button class='mb-2 mx-2 phase1'
            on:click={txtReply}>
            text reply
        </button>
        
        <button class='mb-2 mx-2 phase1'
            on:click={voiceReply}
            >
            voice reply
        </button>
    </div>
</div>

    {#if txt}
    <div class="flex flex-col mx-2w-11/12">
    <p>
        <textarea class='my-1' bind:value={text} placeholder={placeholder} style="width: 100%" />
    </p>
        <button disabled={isUnchanged(text)} on:click={sendReply}>
            send reply
        </button>
</div>
    {/if}
    {#if voice}
        <Voice xy="reply" {doc} />
    {/if}
    <p>
        {#if result}
            <span>{result.kind}</span>
        {/if}
    </p>

<style>

</style>
