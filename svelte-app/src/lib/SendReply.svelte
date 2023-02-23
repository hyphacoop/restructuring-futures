<script>
    import replica from "../store/replica";
    import authorKeypair from "../store/identity";

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function isUnchanged(t) {
        return t == "Reply here";
    }

    let result;

    async function sendReply() {
        let alias = $authorKeypair.address.slice(1, 5);
        let newPath = doc.path.split("!");
        let studioPath = doc.path.split("/");
        let timestamp = Date.now();
        const result = await $replica.replica.set($authorKeypair, {
            text: alias + " replied: " + text,
            path: newPath[0] + timestamp + "/" + "!reply-by-" + alias,
            deleteAfter: deletionTime,
        });
        const studio = await $replica.replica.set($authorKeypair, {
            text: alias + " replied: " + text,
            path:
                "/studio/" +
                studioPath[2] +
                "/" +
                timestamp +
                "/" +
                "reply-by-" +
                alias,
        });
        console.log("result ", result);
        console.log("studio ", studio);
        dispatch("success");
        return result;
    }

    export let doc;
    let text = "Reply here";
    let deletionTime = (Date.now() + 3600000) * 1000;
</script>

<div>
    <p>
        <input bind:value={text} />
    </p>
    <p>
        <button disabled={isUnchanged(text)} on:click={sendReply}>
            Send Reply
        </button>
    </p>
    <p>
        {#if result}
            <span>{result.kind}</span>
        {/if}
    </p>
</div>

<style>
    input {
        background-color: #ffffff;
        padding: 1em;
        border-radius: 15px;
        border: 1px solid #888888;
        margin: 1rem;
        width: fit-content;
    }
</style>
