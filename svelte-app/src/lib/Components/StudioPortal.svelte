<script>
    import { get } from 'svelte/store';
    import settings from "../../store/settings";
    import { studioShares } from "../../store/settings";
    import shareKeypair from "../../store/share";
    import Tooltip from "./Tooltip.svelte"; 
    import { onMount } from 'svelte';

    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

    let selectedShare;

    export let noArtefacts = false;
    
    function updateShareKeypair() {
      const shareAddress = selectedShare;
      const secret = settings.shareSecrets[shareAddress]; // retrieve the secret
      shareKeypair.set({shareAddress, secret}); // set both shareAddress and secret
      // dispatch a 'shareUpdated' event
      dispatch('shareUpdated');
    }
    
    let shareList = [];
    
    studioShares.subscribe(value => {
      shareList = [...value]; 
    });

    onMount(() => {
    if (shareList.length > 0) {
        selectedShare = shareList[0];
    }
});

    </script>

    <div class='flex flex-col {noArtefacts ? "ml-8" : "items-center justify-center mt-12"}'>
        <div class='flex flex-col {noArtefacts ? "" : "items-center justify-center mx-auto"} max-w-3xl w-full md:w-1/2'>
            <Tooltip text="You can choose from any studio you saved in your settings. Settings can be accessed in the server customization in the top left corner and then under 'workspace settings'.">
                {#if !noArtefacts}
                <p>You have reached the Beginning of Studio portals.</p>
                
                {:else}
                <p class='text-left my-4'>proceed to the studio to place your artefact.</p>
                {/if}
            </Tooltip>
            <div class='flex flex-col items-start pt-8 {noArtefacts ? "" : "items-center justify-center mx-auto"}'>
                {#if !noArtefacts}
                <label for="share-switcher" class="text-left">
                    <p>Choose the Studio you want to enter:</p>
                    </label>
                {/if}
                <select
                    id="share-switcher"
                    bind:value="{selectedShare}"
                    class="form-control"
                    on:change={e => { 
                        selectedShare = e.target.value;
                    }}
                >
                    {#each shareList as share (share)}
                        <option value={share}>{share}</option>
                    {/each}
                </select>
                <button class='phase1 my-2 mb-24' on:click="{updateShareKeypair}">enter selected studio</button>
       
            </div>    
        </div>
    </div>
    <style>
        p {
            font-size: 1.2rem;
        }
        label {
            display: block;
        }
        select {
            width: 90%;
            font-size: 1rem;
            margin: 0.25rem;
            padding: 0.5rem 0.75rem;
            border-radius: 0.25rem;
            border: 1px solid #ccc;
        }
    </style>
    