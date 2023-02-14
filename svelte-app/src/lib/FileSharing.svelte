<script>
  import * as Earthstar from "../assets/scripts/earthstar";
  import authorKeypair from "../store/identity";
  import replica from "../store/replica";


  let src = 'images/insert-picture-icon.png'


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
    let fileAttachment = e.target.files[0];
    let removeSpace = fileAttachment.name.replace(/\s+/g, '_');
    let safeName = removeSpace.replace(/[@·,\/#!$%\^&\*;:{}=\-`~()]/g, "");
    let extension = safeName.split('.').pop();
    let fileNoExt = safeName.split('.')[safeName.split('.').length - 2];
    let finalName;
    if (extension === "JPG") {
      extension = "jpeg";
    }
    
    finalName = fileNoExt + "." + extension;
    let fileReady = await readFileAsync(fileAttachment);
    let deletionTime = (Date.now() + 3600000) * 1000;
    let fileUint8 = new Uint8Array(fileReady);
    result = await $replica.replica.set($authorKeypair, {
      path: `/documents/${Date.now()}/!${finalName}`,
      text:
        'from ' +
        $authorKeypair.address.slice(1, 5) +
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
  <p>
    <strong>
      {result.kind}
    </strong>
  </p>
  {#if result.kind === 'success'}
    <p>
    <button on:click>
      See uploaded file
    </button>  
    </p>
  {/if}
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
