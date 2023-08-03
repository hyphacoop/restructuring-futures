<script>
    import replica from "../store/replica";
    import authorKeypair from "../store/identity";

    import Voice from "./Artefacts/Voice.svelte";

    import { createEventDispatcher } from "svelte";


    const dispatch = createEventDispatcher();

    function isUnchanged(t) {
        return t == placeholder;
    }

    let result;
    let txt = false;
    let voice = false;
    let text = "";
    let placeholder = "Type your reply here";
    let lgth = text.length;
  


    async function sendReply() {
        let alias = $authorKeypair.address.slice(1, 5);
        let newPath = doc.path.split("!");
        let deletionTime = doc.deleteAfter;
        let timestamp = Date.now();
        const result = await $replica.replica.set($authorKeypair, {
            text: alias + " replied: " + text,
            path: newPath[0] + timestamp + "/" + "!reply-by-" + alias,
            deleteAfter: deletionTime,
        });
        console.log("result ", result);
        dispatch("success");
        text = '';
        return result;
    }

    export let doc;

    $: if (result !== undefined && result.kind == "success") {
        placeholder = "Send another reply";
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
    <div>
    <button class='mb-2'
        on:click={txtReply}>
        📝Text reply
    </button>
    
    <button
        on:click={voiceReply}
        >
        🔊Voice reply
    </button>
</div>
    {#if txt}
    <p>
        <textarea class='my-2' bind:value={text} placeholder={placeholder} style="width: 100%" />
    </p>
    <p>
        <button disabled={isUnchanged(text)} on:click={sendReply}>
            Send Reply
        </button>
    </p>
    {/if}
    {#if voice}
        <Voice xy="reply" {doc} />
    {/if}
    <p>
        {#if result}
            <span>{result.kind}</span>
        {/if}
    </p>
</div>

<style>

</style>
