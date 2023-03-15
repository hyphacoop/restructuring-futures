<script>
    import * as Earthstar from 'earthstar';
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';

    import authorKeypair from "../store/identity.js";
    import sharedSettings from '../store/settings.js';

    import UploadId from './UploadId.svelte';

    let value;
    let error;
    let showWarning = false;
    let newAlias;
    let uploadWarning = false;
    const settings = new Earthstar.SharedSettings();

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

    // function to check if string starts with a number
    function isNumber(str) {
        return /[0-9]/.test(str);
    }

    function isSpecialChar(str) {
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
    }

    // Function to generate a 4 char pseudo-random ID
    function RandomId() {
        let result = "";
        let alphaCharacter = "abcdefghijklmnopqrstuvwxyz";
        let alphaLength = alphaCharacter.length;
        let allCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let allLength = allCharacters.length;
        result += alphaCharacter.charAt(
            Math.floor(Math.random() * alphaLength)
        );
        for (let i = 0; i < 3; i++) {
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
            showWarning = false;

            // @ts-ignore
            settings.author = identityKeypair;

            sharedSettings.set({
                        settings
                    });
            }
    }

    function handleAlias(event) {
        console.log('event', event)
        newAlias = event.detail;
        value = newAlias;
        uploadWarning = false;
    }

    function handleError() {
        uploadWarning = true;
    }
$: currentAddress = $authorKeypair.address;
$: currentSecret = $authorKeypair.secret;
$: currentAlias = currentAddress.slice(0, 5);
$: value = currentAlias.slice(1,5);


onMount(() => {
        if ($authorKeypair.address.length === 0) {
            generateID('r');
        } else {
            currentAddress = $authorKeypair.address;
            currentSecret = $authorKeypair.secret;
        }
    });

</script>

<div class="id">

    {#if $authorKeypair.address.length !== 0}

            <h1>Identity Keypair</h1>
            <h2><b>{currentAlias}</b></h2>
           
    {/if}
    <p>
        Your identity is represented by a keypair that contains your address and secret. 
    </p>


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

        <UploadId on:alias={handleAlias} on:error={handleError} identityPg={true}/>
    </div>
    
    <p> 
        You can

        <button on:click={() => generateID('r')}>
            generate another identity
        </button>

    or customize your alias in the box below:
    </p>
    <p>
    Your alias is 
    <input type="text"
        spellcheck="false"
        maxlength="4" 
        bind:value 
        on:keypress={() => {showWarning = true}}
        on:focus={() => {showWarning = true}}
        on:keypress={() => generateID()}
        >
    </p>
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
            {#if uploadWarning === true}
            <blockquote transition:fly="{{ y: 200, duration: 2000 }}">
                <strong>Please upload a valid identity file</strong>
            </blockquote>
            {/if}
        </div>
</div>
<style>
    input {
        width: 5ch;
        height: 1.5rem;
        font-size:1.3rem;
        resize: none;
        padding:0.25rem;
        border-radius: 0.5rem;
        text-align: center;
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
        border:1px solid transparent;
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
    h2 {
        font-family: 'Fungal Grow 900 Thickness 500';
    }
    .id {
        width: -moz-available;
word-break: break-word;
    }
</style>