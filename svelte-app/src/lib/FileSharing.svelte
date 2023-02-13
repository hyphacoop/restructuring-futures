<script>
  import * as Earthstar from "../assets/scripts/earthstar";
  import authorKeypair from "../store/identity";
  import shareKeypair from "../store/share";
  import replica from "../store/replica";

  let shareDetails;
  let authorDetails;
  let replicaDetails;
  let src = 'images/insert-picture-icon.png'

  shareKeypair.subscribe((r) => {
    shareDetails = r;
  });

  authorKeypair.subscribe((r) => {
    authorDetails = r;
  });

  replica.subscribe((r) => {
    replicaDetails = r;
  });



  let fileinput;
  let result;

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
    let image = e.target.files[0];
    let removeSpace = image.name.replace(/\s+/g, '_');
    let safeName = removeSpace.replace(/[@·,\/#!$%\^&\*;:{}=\-`~()]/g, "");
    console.log('safeName', safeName);
    let fileReady = await readFileAsync(image);
    let deletionTime = (Date.now() + 3600000) * 1000;
    console.log('fileReady', fileReady);
    let fileUint8 = new Uint8Array(fileReady);
    result = await replicaDetails.replica.set(authorDetails, {
      path: `/images/${Date.now()}/!${safeName}`,
      text:
        'from ' +
        authorDetails.address.slice(1, 5) +
        " on " +
        new Date().toLocaleString(),
      attachment: fileUint8,
      deleteAfter: deletionTime
    });
    console.log("Result: ", result);
    if (Earthstar.isErr(result)) {
      console.error(result);
    }
    return result;
  }

  $: result = result;

</script>

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
{#if result}
  <p>{result.kind}</p>
{/if}

</div>

<style>
  .upload {
    height: 50px;
    width: 50px;
    cursor: pointer;
  }
  .uploadText {
    cursor: pointer;
  }	
</style>
