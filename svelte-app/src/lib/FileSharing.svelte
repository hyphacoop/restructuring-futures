<script>
  import * as Earthstar from "../assets/scripts/earthstar";
  import authorKeypair from "../store/identity";
  import replica from "../store/replica";

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let src = 'images/insert-picture-icon.png'

  export let inStudio;

  let fileinput;
  let result;
  let studio;

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
        console.log('typeof', reader.result);
      };

      reader.onerror = reject;

      reader.readAsArrayBuffer(file);
    });
  }

  async function onFileSelected(e) {
    // from the file selected
    let fileAttachment = e.target.files[0];
    // remove spaces from file name
    let removeSpace = fileAttachment.name.replace(/\s+/g, '_');
    // remove special characters from file name
    let safeName = removeSpace.replace(/[@·,\/#!$%\^&\*;:{}=\-`~()]/g, "");
    // get file extension
    let extension = safeName.split('.').pop();
    // get file name without extension
    let fileNoExt = safeName.split('.')[safeName.split('.').length - 2];
    // set final file name
    let finalName;
    // if file extension is jpg, change to jpeg
    if (extension === "JPG" || extension === "jpg") {
      extension = "jpeg";
    }
    // assemble final file name
    finalName = fileNoExt + "." + extension;
    // get timestamp
    let timestamp = Date.now();
    // read file
    let fileReady = await readFileAsync(fileAttachment);
    // set deletion time
    let deletionTime = (Date.now() + 3600000) * 1000;
    // set file to Uint8Array
    let fileUint8 = new Uint8Array(fileReady);
    // if not in studio, write file to the commons
    if (!inStudio) {
      result = await $replica.replica.set($authorKeypair, {
        path: `/documents/${timestamp}/!${finalName}`,
        text:
          'Shared by ' +
          $authorKeypair.address.slice(1, 5) +
          " on " +
          new Date().toLocaleString(),
        attachment: fileUint8,
        deleteAfter: deletionTime
      });
    }
    // if in studio, remove ephemeral path and write file to studio
    studio = await $replica.replica.set($authorKeypair, {
      path: `/studio/${timestamp}/${finalName}`,
      text:
        'Shared by ' +
        $authorKeypair.address.slice(1, 5) +
        " on " +
        new Date().toLocaleString(),
      attachment: fileUint8,
    });
    console.log("Result: ", result);
    if (Earthstar.isErr(result)) {
      console.error(result);
    }
    console.log("Studio: ", studio);
    if (Earthstar.isErr(studio)) {
      console.error(studio);
    }
    dispatch('success');
    return result;
  }

  $: result = result;

</script>
<div>
  <div>
    <img
      class="upload"
      {src}
      alt="Comics icons created by Freepik - Flaticon"
      on:click={() => {
        fileinput.click();
      }}
      on:keypress={() => {
        fileinput.click();
      }}
    />
    <div
      class="uploadText"
      on:click={() => {
        fileinput.click();
      }}
      on:keypress={() => {
        fileinput.click();
      }}
    >
      Upload file
    </div>
    <input
      style="display:none"
      type="file"
      accept=".jpg, .jpeg, .png, .gif, .txt, .pdf, .md, .webm, .mp3, .ogg, .wav"
      on:change={(e) => onFileSelected(e)}
      bind:this={fileinput}
    />
</div>
{#if result}
  <p>
    <strong>
      {result.kind}
    </strong>
  </p>
{/if}

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
