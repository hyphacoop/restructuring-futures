<script>
    import * as Earthstar from "earthstar";
    import authorKeypair from "../../store/identity";
    import replica from "../../store/replica";
    import shareKeypair from "../../store/share";

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let uploadResult;
    let media = [];
    let mediaRecorder = null;
    let recording = false;
    let audioURL = null;
    let blob = null;
    let alias = $authorKeypair.address.slice(1, 5);

    export let xy = undefined;
    export let doc = undefined;
    export let title = undefined;
    export let notes = undefined;
    export let isValid = true;

    async function handleRecording() {
        if (recording) {
            mediaRecorder.stop();
            let mimeType = mediaRecorder.mimeType;
            if (mimeType === "") {
                mimeType = "audio/ogg; codecs=opus";
            }
            console.log("mediaRecorder", mediaRecorder);
            console.log("mediaRecorder mime", mediaRecorder.mimeType);

            recording = false;
            mediaRecorder.ondataavailable = (e) => media.push(e.data);
            await new Promise((resolve) => {
                mediaRecorder.onstop = function () {
                    blob = new Blob(media, { type: mimeType });
                    audioURL = URL.createObjectURL(blob);
                    console.log("blob", blob);
                    resolve();
                };
            });
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.start();

            console.log("mediaRecorder", mediaRecorder);
            console.log("mediaRecorder mime", mediaRecorder.mimeType);
            console.log("recording");

            recording = true;
        }
    }

    async function handleUpload() {
        let textContent;
        if (notes && title) {
            textContent = `#Title: ${title}#Notes: ${notes}`;
        } else if (title) {
            textContent = `#Title: ${title}`;
        } else {
            textContent = "";
        }

        let timestamp = Date.now();
        let dateShared = new Date().toLocaleString();
        let deletionTime = (Date.now() + 2548800000) * 1000;
        let mimeType = mediaRecorder.mimeType || "audio/ogg; codecs=opus";
        let noCodecs = mimeType.split(";")[0];
        let extension = noCodecs.split("/")[1];

        const arrayBuffer = await readBlobAsArrayBuffer(blob);
        const uInt8 = new Uint8Array(arrayBuffer);

        console.log("mime", mimeType);
        let docPath = `/documents/${xy[0]}/${xy[1]}/${timestamp}/!voice-note-by-${alias}.${extension}`;

        let voiceDoc = {
            path: docPath,
            text: `Voice note shared by ${alias} on ${dateShared} ${textContent}`,
            attachment: uInt8,
        }

        

      
        if (xy == "reply") {
        const replyPathParts = doc.path.split("!");
        voiceDoc.path = `${replyPathParts[0]}${timestamp}/!reply-by-${alias}.${extension}`;
        voiceDoc.text = `${alias} replied with voice <br>Shared on ${dateShared}`;
        }
        console.log('shareKeypair', $shareKeypair)
        // Add deleteAfter only if we are in the commons
        if ($shareKeypair.shareAddress.includes('commons')) {
            if (xy == "reply") { 
                voiceDoc.deleteAfter = doc.deleteAfter; 
            }
            else {
                voiceDoc.deleteAfter = deletionTime;
                console.log('added deleteAfter to doc');
            }
        } else {
            // remove the '!' from the path (to make it non-ephemeral)
            voiceDoc.path = docPath.replace('!', ''); 
            console.log('removed ! from path');
        }
    const result = await $replica.replica.set($authorKeypair, voiceDoc);
    console.log("Upload Result: ", result);

    // Dispatch the correct event
    dispatch(xy == "reply" ? "success" : "upload");

    // Clear the media if not a reply
    media = [];

    return result;
      
    }

    function readBlobAsArrayBuffer(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    }

    async function resetRecording() {
        audioURL = null; // clear blob url
        media = []; // clear recorded media
        await handleRecording(); // start recording again
    }

    $: if (title && notes) {
        console.log("title and note", title, notes);
    }
</script>

{#if audioURL}
    <!-- Show only if audioURL is set -->
    <div class="text-left m-2">
        <h5 class="m-2">Review your recording</h5>
        <audio controls class="my-6 mx-2">
            <source src={audioURL} type="audio/ogg" />
            Your browser does not support the audio element.
        </audio>
        {#if !isValid}
            <div>
                The upload button is disabled because a title is required.
            </div>
        {/if}
        <button on:click={resetRecording}>Record again</button>
        <button on:click={handleUpload} disabled={!isValid}>Upload</button>
    </div>
{:else}
<div class="text-left">
    <div>
    {#if xy !== 'reply'}

        <h5 class="m-2">Record your voice note</h5>
        <div>
            Click the button below to start recording. Click again to stop.
        </div>

    {/if}
                <div class="mt-6">
                <button
                    class="phase1 mt-6"
                    on:click={async () => {
                        handleRecording();
                    }}
                    on:keypress={async () => {
                        handleRecording();
                    }}
                >
                    {#if recording}
                        Stop recording
                    {:else}
                        Record audio
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    h5 {
        word-break: break-word;
        width:60%
    }
    div {
        margin: 0.5rem;
    }
    .auto-width {
        width: -webkit-fill-available;
        width: -moz-available;
        width: 100%;
    }
    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    audio {
        border-radius: 0.5rem;
        width: 50%;
        }
</style>
