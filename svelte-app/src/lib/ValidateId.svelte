<script>
    import * as Earthstar from 'earthstar';
    import authorKeypair from "../store/identity.js";
    import { createEventDispatcher } from 'svelte';
    import settings from '../store/settings.js';

    import UploadId from './UploadId.svelte';

    const dispatch = createEventDispatcher();

    let keypairInput = '';
    let error = '';

    function validateKeypairObject(keypairObject) {
        if (keypairObject.address && keypairObject.secret) {
            if (Earthstar.isErr(Earthstar.checkAuthorIsValid(keypairObject.address))) {
                error = "Invalid address";
                dispatch('error');
            } else {
                authorKeypair.set({
                    address: keypairObject.address,
                    secret: keypairObject.secret,
                });
                // @ts-ignore
                settings.author = keypairObject;

                dispatch('validated');
            }
        } else {
            error = "Invalid keypair";
            dispatch('error');
        }
    }

    function validateKeypair() {
        try {
            let keypairObject = JSON.parse(keypairInput);
            validateKeypairObject(keypairObject);
        } catch (err) {
            error = "Invalid JSON";
            dispatch('error');
        }
    }

    function handleNewIdentity(event) {
        validateKeypairObject(event.detail);
    }
</script>

<div class="flex flex-col items-start mx-0">
    <label for="keypair">Have an existing ID?</label>
    <div class="flex md:flex-row items-end mx-0 flex-col">
        <textarea class='px-5 my-2' id="keypair" bind:value={keypairInput} placeholder={`Paste it here:       \n{\n"address": "", \n"secret": ""\n}`}></textarea>
        <button class='phase1 mx-4 my-2' on:click={validateKeypair}>Validate ID</button>
    
     <UploadId on:alias on:error on:newIdentity={handleNewIdentity} />
    </div>
    {#if error}
        <p class="text-2xl">{error}</p>
    {/if}
</div>

<style>
    textarea {
        min-height: 9rem;
        resize: both;
    }
    div {
        margin: 1rem;
    }
</style>
