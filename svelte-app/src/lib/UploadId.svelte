<script>
    import authorKeypair from "../store/identity.js";

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();


    let fileinput;
    let alias;

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

<button 
    class:identity-view="{identityPg === true}"
    on:click={() => {fileinput.click()}}>
    Upload an identity file
</button>

<style>
    button {
        font-family: 'Fungal Grow 100 Thickness 500';
    }
    .identity-view {
        font-family: 'Fungal Grow 100 Thickness 500';
        text-decoration:underline;
        border:1px solid transparent;
        background: none;
        padding:0.25rem;}
    .identity-view:hover {
        cursor:pointer;
        color:white;
        text-decoration: none;
        background-color: black;
        border: 1px solid black;
    }

</style>

