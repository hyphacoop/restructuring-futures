<script>
    import * as Earthstar from "earthstar";
    import { onMount } from "svelte";

    import authorKeypair from "../store/identity.js";

    let identityDetails;

    authorKeypair.subscribe(value => {
		identityDetails = value;
	});


    // download identity file as json
    function Download() {
        let element = document.createElement("a");
        let file = new Blob([JSON.stringify(currentIdentity)], {
            type: "text/plain",
        });
        let filename = currentIdentity.address + ".json";
        element.href = URL.createObjectURL(file);
        element.download = filename;
        element.style.display = "none";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

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
    value = authorAddress.slice(1, 5);
    }

    // function to check if string starts with a number
    function isNumber(str) {
        return /[0-9]/.test(str);
    }

    function isSpecialChar(str) {
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
    }

    // Function to generate a 4 char pseudo-random ID
    function RandomId() {
        var result = "";
        var alphaCharacter = "abcdefghijklmnopqrstuvwxyz";
        var alphaLength = alphaCharacter.length;
        var allCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
        var allLength = allCharacters.length;
        result += alphaCharacter.charAt(
            Math.floor(Math.random() * alphaLength)
        );
        for (var i = 0; i < 3; i++) {
            result += allCharacters.charAt(
                Math.floor(Math.random() * allLength)
            );
        }
        return result;
    }

    // Create a new author keypair with the random id.
    export async function generateID() {
        let identityKeypair = await Earthstar.Crypto.generateAuthorKeypair(
            RandomId()
        );
        // @ts-ignore
        let authorAddress = identityKeypair.address;
        // @ts-ignore
        let authorSecret = identityKeypair.secret;

        authorKeypair.set({
                    address: authorAddress,
                    secret: authorSecret,
                });
    }

    onMount(() => {
        generateID();
    });


$: currentAddress = identityDetails.address;
$: currentSecret = identityDetails.secret;
$: currentIdentity = identityDetails;
$: currentAlias = currentAddress.slice(0, 5);


</script>

<div>
    {#await generateID()}
        <h2>Loading Identity details</h2>
    {:then data}
        <h3>Identity</h3>
        Your alias is <b>{currentAlias}</b>
        <br />

        <br />
        <b>Address:</b> {currentAddress}
        <br />
        <b>Secret</b>: {currentSecret}<br />

        <button on:click={() => Download()}>
            Download your identity file
        </button>
       
    {/await}
    <button on:click={() => generateID()}>
        Generate new Identity
    </button>
</div>
