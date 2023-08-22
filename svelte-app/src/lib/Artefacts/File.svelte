<script>
  import * as Earthstar from "earthstar";
  import authorKeypair from "../../store/identity";
  import shareKeypair from "../../store/share";
  import replica from "../../store/replica";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let xy = [0, 0];

  let fileinput;
  let result;
  let docPath;
  let textContent;
  let errorMessage = '';

  export let title = undefined;
  export let notes = undefined;
  export let isValid = true;

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
        console.log("typeof", reader.result);
      };

      reader.onerror = reject;

      reader.readAsArrayBuffer(file);
    });
  }

  async function onFileSelected(e) {
    if (notes && title) {
      textContent = "#Title: " + title + "#Notes: " + notes;
    } else if (title) {
      textContent = "#Title: " + title;
    } else {
      textContent = "";
    }
    let date = new Date();
    let readableDate = new Intl.DateTimeFormat('en-US').format(date);
    // from the file selected
    let fileAttachment = e.target.files[0];
    // remove spaces from file name
    let removeSpace = fileAttachment.name.replace(/\s+/g, "_");
    // remove special characters from file name
    let safeName = removeSpace.replace(/[@·,\/#!$%\^&\*;:{}=\-`~()]/g, "");
    // get file extension
    let extension = safeName.split(".").pop();
    // get file name without extension
    let fileNoExt = safeName.split(".")[safeName.split(".").length - 2];
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
    let deletionTime = (Date.now() + 2548800000) * 1000;
    // set file to Uint8Array
    let fileUint8 = new Uint8Array(fileReady);
    // set path
    if (xy.length >= 3 && xy[2] > 1) {
          docPath = `/documents/page${xy[2]}/${xy[0]}/${xy[1]}/${timestamp}/!${finalName}`;
      } else {
          docPath = `/documents/${xy[0]}/${xy[1]}/${timestamp}/!${finalName}`;
    }


    let docText =
        "Shared by " +
        $authorKeypair.address.slice(1, 5) +
        " on " +
        readableDate +
        " " +
        textContent;

    let thisDoc = {
      path: docPath,
      text: docText,
      attachment: fileUint8,
    }

    // Add deleteAfter only if we are in the commons
    if ($shareKeypair.shareAddress.includes('commons')) {
        thisDoc.deleteAfter = deletionTime;
        console.log('added deleteAfter to doc');
    } else {
      if (docPath.includes('!')) {
                thisDoc.path = docPath.replace('!', '');
            } else {
                thisDoc.path = docPath;
          }
    }
    
    result = await $replica.replica.set($authorKeypair, thisDoc);

    console.log("Result: ", result);
    if (Earthstar.isErr(result)) {
      console.error(result);
      errorMessage = result.message;
    } else {
      console.log("Success!");
      dispatch("upload");
    }
    return result;
  }

  $: result = result;
</script>

<div>
  <div class="text-left">
    <h5 class="m-2">Upload a file</h5>
    <div>Start by entering your title and the optional note.</div>
    <div>Once the file is selected, it will be automatically uploaded.</div>
    {#if !isValid}
      <div>The upload button is disabled because a title is required.</div>
    {/if}
    <button
      class="phase1 m-2"
      on:click={() => {
        fileinput.click();
      }}
      on:keypress={() => {
        fileinput.click();
      }}
      disabled={!isValid}
    >
      file upload
    </button>

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
    margin: 0.5rem;
  }
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>
