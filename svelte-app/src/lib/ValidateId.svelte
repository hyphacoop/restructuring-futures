<script>
    import authorKeypair from "../store/identity.js";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let keypairInput = '';

    function validateKeypair() {
        try {
            let keypairObject = JSON.parse(keypairInput);
            if (keypairObject.address && keypairObject.secret) {
                authorKeypair.set({
                    address: keypairObject.address,
                    secret: keypairObject.secret,
                });
                dispatch('validated');
            } else {
                dispatch('error');
            }
        } catch (error) {
            dispatch('error');
        }
    }
</script>

<div class="flex flex-col items-start">
    <label for="keypair">Have an existing ID?</label>
    <div class="flex flex-row items-end">
        <textarea id="keypair" bind:value={keypairInput} placeholder={`Paste it here:       \n{"address": "", "secret": ""}`}></textarea>
        <button class='phase1' on:click={validateKeypair}>Validate ID</button>
    </div>
  
</div>

<style>
    div {
        gap: 10px;
    }
    
</style>
