<script>
    import * as Earthstar from 'earthstar';
    import authorKeypair from "../store/identity.js";
    import { createEventDispatcher } from 'svelte';
    import sharedSettings from '../store/settings.js';

    const settings = new Earthstar.SharedSettings();

    const dispatch = createEventDispatcher();

    let keypairInput = '';
    let error = '';

    function validateKeypair() {
        try {
            let keypairObject = JSON.parse(keypairInput);
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

                    sharedSettings.set({
                        settings
                    });
                    dispatch('validated');
                }
            } else {
                error = "Invalid keypair";
                dispatch('error');
            }
        } catch (err) {
            error = "Invalid JSON";
            dispatch('error');
        }
    }
</script>

<div class="flex flex-col items-start mx-0">
    <label for="keypair">Have an existing ID?</label>
    <div class="flex flex-row items-end mx-0">
        <textarea class='px-5' id="keypair" bind:value={keypairInput} placeholder={`Paste it here:       \n{\n"address": "", \n"secret": ""\n}`}></textarea>
        <button class='phase1 mx-4' on:click={validateKeypair}>Validate ID</button>
    </div>
    {#if error}
        <p class="text-2xl">{error}</p>
    {/if}
</div>

<style>
    textarea {
        min-height: 9rem;
    }
</style>
