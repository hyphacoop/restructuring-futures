<script>
    import * as Earthstar from "earthstar";

    import Voice from "./Voice.svelte";
    import File from "./File.svelte";

    import authorKeypair from "../../store/identity";
    import replica from "../../store/replica";

    import { createEventDispatcher } from "svelte";

    export let filetype;
    export let xy = [0, 0];

    let inputArea;
    let artifactTitle = "";
    let artifactNotes = "";
    let textContent;
    let result;
    let alias = null;
    let isValid = true;

    let timestamp = Date.now();
    let deletionTime = (Date.now() + 2548800000) * 1000;

    const dispatch = createEventDispatcher();

    async function submitText() {
        // we convert text to Uint8Array, which is used in earthstar as an attachment
        let textAsBlob = new Blob([inputArea.value], { type: "text/markdown" });
        let arrayBuffer = await textAsBlob.arrayBuffer();
        let textUint8 = new Uint8Array(arrayBuffer);
        let alias = $authorKeypair.address.slice(1, 5);
        if (artifactNotes) {
            textContent =
                "#Title: " + artifactTitle + "#Notes: " + artifactNotes;
        } else {
            textContent = "#Title: " + artifactTitle;
        }

        result = await $replica.replica.set($authorKeypair, {
            path: `/documents/${xy[0]}/${xy[1]}/${timestamp}/!text-input-by-${alias}.md`,
            text:
                "Text input by " +
                $authorKeypair.address.slice(1, 5) +
                " on " +
                new Date().toLocaleString() +
                textContent,
            attachment: textUint8,
            deleteAfter: deletionTime,
        });

        console.log("Result: ", result);
        if (Earthstar.isErr(result)) {
            console.error(result);
        }
        dispatch("success");
        return result;
    }

    function confirmUpload(event) {
        console.log("event in Upload.svelte", event);
        dispatch("success");
    }

    $: {
        if (artifactTitle && artifactTitle.trim() !== "") {
            isValid = true;
        } else {
            isValid = false;
        }
    }
    $: console.log("isValid", isValid);
    $: console.log("filetype in Upload.svelte", filetype);
    $: console.log("filetype in Upload.svelte", filetype);
</script>

<div class="h-[80vh] w-4/5 fixed">
    <div class="p-6 w-full h-full bg-white">
        <div class="flex flex-row justify-start">
            <input
                id="titleInput"
                class="align-left m-2"
                type="text"
                placeholder="Enter a title (required)"
                bind:value={artifactTitle}
            />
        </div>
        <div class="flex flex-row justify-between">
            <div class="flex flex-col w-[50vw] items-start">
                {#if filetype === "text"}
                    <textarea
                        id="mainInput"
                        placeholder="Enter text"
                        bind:value={inputArea}
                    />
                {:else if filetype === "audio"}
                    <Voice
                        {xy}
                        on:upload={confirmUpload}
                        title={artifactTitle}
                        notes={artifactNotes}
                        {isValid}
                    />
                {:else if filetype === "file"}
                    <File
                        {xy}
                        on:upload={confirmUpload}
                        title={artifactTitle}
                        notes={artifactNotes}
                        {isValid}
                    />
                {/if}
            </div>
            <div class="pr-6">
                <h5 class="text-left">Notes</h5>
                <input
                    type="text"
                    placeholder="Enter optional notes"
                    bind:value={artifactNotes}
                />
            </div>
        </div>
        <div class="flex flex-row justify-end my-6">
            <div class="flex flex-col">
                {#if filetype === "text"}
                    {#if !isValid}
                        <div>Title is required.</div>
                    {/if}
                    <button
                        class="phase1"
                        on:click={submitText}
                        disabled={!isValid}
                    >
                        Submit
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    #titleInput {
        font-size: 1.5em;
        font-weight: bold;
        width: auto;
        margin-bottom: 2rem;
    }
    #mainInput {
        width: 100%;
        min-height: 40vh;
        height: auto;
        font-size: 1;
        font-family: "brandon-grotesque", "Gill Sans", "Gill Sans MT", Calibri,
            "Trebuchet MS", sans-serif;
    }
    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
</style>
