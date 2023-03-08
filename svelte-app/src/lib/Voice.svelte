<script>
  import * as Earthstar from 'earthstar';
  import authorKeypair from "../store/identity";
  import replica from "../store/replica";

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  import { onMount } from "svelte";
  import Studio from './Studio.svelte';

  let uploadResult;
  let studioResult;
  let media = [];
  let mediaRecorder = null;
  let recording = false;
  export let xy = undefined;

  let src = 'images/Speaker_Icon.png'

  export let inStudio;
  export let doc = undefined;

  function readFile(file) {
        return new Promise((resolve, reject) => {
          // Create file reader
          let reader = new FileReader()
      
          // Register event listeners
          reader.addEventListener("loadend", e => resolve(e.target.result))
          reader.addEventListener("error", reject)
      
          // Read file
          reader.readAsArrayBuffer(file)
        })
      }


  async function handleRecording() {
    if (recording) {
      mediaRecorder.stop();

      console.log('mediaRecorder', mediaRecorder);
      console.log('mediaRecorder mime', mediaRecorder.mimeType);

      recording = false;
      mediaRecorder.ondataavailable = (e) => media.push(e.data);
      mediaRecorder.onstop = async function (e) {
        let timestamp = Date.now();
        let dateShared = new Date().toLocaleString()
        let deletionTime = (timestamp + 14400000) * 1000;
        let mimeType = mediaRecorder.mimeType;
        if (mimeType === '') {
          mimeType = 'audio/ogg; codecs=opus';
        }
        let noCodecs = mimeType.split(";")[0];
        let extension = noCodecs.split("/")[1];
        const blob = new Blob(media, { type: mimeType });
        console.log('blob', blob)
        const uInt8 = new Uint8Array(await readFile(blob));
        console.log('mime', mimeType);
        let alias = $authorKeypair.address.slice(1, 5);
        // use grid path if xy is defined
        if (xy !== undefined && xy !== 'reply') {
          // if not in studio, upload to ephemeral path
          if (!inStudio) {
          uploadResult = await $replica.replica.set($authorKeypair, {
              path: `/documents/${xy[1]}/${xy[0]}/${timestamp}/!${alias}${timestamp}.${extension}`,
              text:
              'Voice note shared by ' +
              alias +
              " on " +
              dateShared,
              attachment: uInt8,
              deleteAfter: deletionTime
          });
          }
          // if in studio, remove ephemeral path and write file to studio
          studioResult = await $replica.replica.set($authorKeypair, {
          path: `/studio/${xy[1]}/${xy[0]}/${timestamp}/${alias}${timestamp}.${extension}`,
          text:
              'Voice note shared by ' +
              alias +
              " on " +
              dateShared,
          attachment: uInt8,
          });
          dispatch('upload');
          console.log("Upload Result: ", uploadResult);
          console.log("Studio Result: ", studioResult);
          media = [];
          // if it is a reply, use the reply path
          } else if (xy == 'reply') {
            let newPath = doc.path.split("!");
            let studioPath = newPath[0].replace('/documents', '/studio');
            const result = await $replica.replica.set($authorKeypair, {
              text: alias + ' replied with voice' +
              "<br>Shared on " +
              dateShared,
              path: newPath[0] + timestamp + "/" + "!reply-by-" + alias + '.' + extension,
              deleteAfter: deletionTime,
              attachment: uInt8,
          });
          const studio = await $replica.replica.set($authorKeypair, {
              text:  alias + ' replied with voice' +
              "<br>Shared on " +
              dateShared,
              path:
                  studioPath +
                  timestamp +
                  "/" +
                  "reply-by-" + alias + '.' + extension,
              attachment: uInt8,
          });
          console.log("result ", result);
          console.log("studio ", studio);
          dispatch("success");
          return result;
          }
      };
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.start();

      console.log('mediaRecorder', mediaRecorder);
      console.log('mediaRecorder mime', mediaRecorder.mimeType);
      console.log('recording');

      recording = true;
    }
  }
</script>
<div>
    <div>
        <img
        class="upload"
        {src}
        alt="Speaker Icon"
        on:click={() => {
        handleRecording();
        }}
        on:keypress={() => {
        handleRecording();
        }}
        />
        <div
          class="uploadText"
          on:click={() => {
          handleRecording();
          }}
          on:keypress={() => {
          handleRecording();
          }}
          >
          {#if recording}
              Stop recording
          {:else}
              Record audio
          {/if}
        </div>
    </div>
</div>
<style>
    div {
        margin:0.5rem;
    }
    .upload {
      height: 50px;
      width: 50px;
      cursor: pointer;
    }
    .uploadText {
      cursor: pointer;
    }	
  </style>
  