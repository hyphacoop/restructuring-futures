<script>
    import authorKeypair from "../store/identity.js";

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();


    let fileinput;
    let alias;
    let src = 'images/upload-img.png';

    export let identityPg = false;



    // read identity file as json
    function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  }
    // select file and set keypair
    async function onFileSelected(e) {
        // from the file selected
        let fileAttachment = e.target.files[0];
        let fileReady = await readFileAsync(fileAttachment);
        try {
            let keypairObject = JSON.parse(fileReady);
            
            console.log(typeof keypairObject);
            console.log('fileReady', fileReady);
            // @ts-ignore
            let authorAddress = keypairObject.address;
            console.log('authorAddress', authorAddress)
            // @ts-ignore
            let authorSecret = keypairObject.secret;
            console.log('authorSecret', authorSecret)
            authorKeypair.set({
                            address: authorAddress,
                            secret: authorSecret,
                        });
            alias = authorAddress.slice(1, 5);
            dispatch('alias', alias);
        } catch (error) {
            dispatch('error');
        }
    }



</script>

<input
    style="display:none"
    type="file"
    accept=".json, .txt"
    on:change={(e) => onFileSelected(e)}
    bind:this={fileinput}
/>
<div class='flex w-auto lg:w-11/12 items-center align-center flex-col'>
<button 
    class='tooltip phase1 my-2 '
    on:click={() => {fileinput.click()}}>
    
    Upload your current alias in .JSON

    <span class="tooltiptext">It is a JSON file</span>
</button>
</div>
<style>
    button {
        text-align: center;
    }
    .tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: var(--dark-text-red);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  top: 110%; /* Position the tooltip above the button */
  left: 50%;
  margin-left: -60px; /* Use half of the width to center the tooltip */
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>