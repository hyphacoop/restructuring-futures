<script>
    import replica from "../store/replica";
    import authorKeypair from "../store/identity";

    import Voice from "./Voice.svelte";

    import { createEventDispatcher } from "svelte";


    const dispatch = createEventDispatcher();

    function isUnchanged(t) {
        return t == "Reply here";
    }

    let result;
    let txt = false;
    let voice = false;
    let text = "Reply here";
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
        return result;
    }

    export let doc;

    $: if (result !== undefined && result.kind == "success") {
        text = "Send another reply";
        text = text;
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
    <button
        on:click={txtReply}>
        📝Text reply
    </button>
    
    <button
        on:click={voiceReply}
        >
        🔊Voice reply
    </button>

    {#if txt}
    <p>
        <input bind:value={text} style="width: {lgth}ch" />
    </p>
    <p>
        <button disabled={isUnchanged(text)} on:click={sendReply}>
            Send Reply
        </button>
    </p>
    {/if}
    {#if voice}
    <p>
        <Voice xy="reply" {doc} />
    </p>
    {/if}
    <p>
        {#if result}
            <span>{result.kind}</span>
        {/if}
    </p>
</div>

<style>
    input {
        background-color: #ffffff;
        color:black;
        padding: 1em;
        margin: 0rem;
    }
</style>
