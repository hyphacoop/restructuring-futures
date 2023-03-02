<script>
    import * as Earthstar from 'earthstar';
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';

    import authorKeypair from "../store/identity.js";

    let fileinput;
    let value = RandomId();
    let error;
    let showWarning = false;

    // download identity file as json
    function Download() {
        let element = document.createElement("a");
        let file = new Blob([JSON.stringify($authorKeypair)], {
            type: "text/plain",
        });
        let filename = $authorKeypair.address + ".json";
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

    // Create a new author keypair from the alias.
    export async function generateID(r) {
        if (r == 'r') {
            value = RandomId();
                }
        let firstChar = value.slice(0,1);
        if (isNumber(firstChar)) {
            console.log('firstChar', firstChar)
            error = "ID must start with a letter";
        } else if (value.length !== 4) {
            error = "ID must be 4 characters long";
        } else if (isSpecialChar(value)) {
            error = "ID must not contain special characters";
        } else {
            let identityKeypair = await Earthstar.Crypto.generateAuthorKeypair(
                    value
                );
            // @ts-ignore
            let authorAddress = identityKeypair.address;
            // @ts-ignore
            let authorSecret = identityKeypair.secret;

            authorKeypair.set({
                        address: authorAddress,
                        secret: authorSecret,
                    });
            error = null;
            showWarning = false
            }
    }

    onMount(() => {
        generateID();
    });


$: currentAddress = $authorKeypair.address;
$: currentSecret = $authorKeypair.secret;
$: currentAlias = currentAddress.slice(0, 5);


</script>

<div>
    {#await generateID()}
        <h2>Loading Identity details</h2>
    {:then data}
        <h1>Identity Keypair</h1>
        <h2>Your alias is <b>{currentAlias}</b></h2>

    {/await}
    
    <p>
        Your identity is represented by a keypair that contains your address and secret. 
    </p>

    <input
        style="display:none"
        type="file"
        accept=".json, .txt"
        on:change={(e) => onFileSelected(e)}
        bind:this={fileinput}
    />
    <div class="flex">
        <p>
            <b>
                Address:
            </b> 
            {currentAddress}
        <br>
            <b>
                Secret:
            </b> 
            {currentSecret}
        </p>
    </div>
<p>
    You can download it and reuse it later.
</p>
    <div class='flex'>
        <button on:click={() => Download()}>
            Download your identity file
        </button>

        <button on:click={() => {fileinput.click()}}>
            Upload an identity file
        </button>
    </div>
    
    <p> 
        You can

        <button on:click={() => generateID('r')}>
            generate another identity
        </button>

    or customize your alias in the box below:
    </p>
    <textarea 
        spellcheck="false"
        maxlength="4" 
        bind:value 
        on:focus={() => {showWarning = true}}
        on:keypress={() => generateID()}
        ></textarea>
        <div>
       
            {#if showWarning}
            <blockquote transition:fly="{{ y: 200, duration: 2000 }}">
                {#if error === "ID must be 4 characters long"}
                <i>
                    A valid id <strong>needs to be 4 characters long</strong>. 
                </i>
                
                {:else if error === "ID must start with a letter"}
                <i>
                    <strong>A valid alias must begin with a letter.</strong> It needs to be 4 characters long and can only contain letters and numbers.
                </i>
                {:else if error === "ID must not contain special characters"}
                <i>
                    <strong>
                        Special characters are not allowed.
                    </strong>
                    <br>
                </i>
                {:else}
                Press enter to generate a new keypair.
                {/if}
            </blockquote>
            {/if}
        </div>
</div>
<style>
    textarea {
        width: 4ch;
        height: 1.5rem;
        font-size:1.3rem;
        resize: none;
        padding:0.25rem;
        border-radius: 0.5rem;
    }
    .flex {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        margin:0.5rem;
    }
    button {
        font-family: 'Fungal Grow 100 Thickness 500';
        text-decoration:underline;
        background: none;
        padding:0.25rem;}
    button:hover {
        cursor:pointer;
        color:white;
        text-decoration: none;
        background-color: black;
        border: 1px solid black;
    }
    h1 {
        font-family: 'Fungal Grow 500 Thickness 500';
    }
</style>