<script>
    import { get } from 'svelte/store';
    import settings from "../../store/settings";
    import { studioShares, commonsShares } from "../../store/settings";
    import shareKeypair from "../../store/share";
    import Tooltip from "./Tooltip.svelte"; 
    import { onMount } from 'svelte';

    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

    let selectedShare;

    export let noArtefacts = false;
    export let topOfCommons = false;
    export let commons = false;
   
    function updateShareKeypair() {
      const shareAddress = selectedShare;
      const secret = settings.shareSecrets[shareAddress]; // retrieve the secret
      shareKeypair.set({shareAddress, secret}); // set both shareAddress and secret
      // dispatch a 'shareUpdated' event
      dispatch('shareUpdated');
    }
    
    let studioList = [];
    let commonsList = [];
    let shareList = [];
    
    studioShares.subscribe(value => {
      studioList = [...value]; 
    });

    commonsShares.subscribe(value => {
      commonsList = [...value]; 
    });

    onMount(() => {
        if (commons) {
        shareList = commonsList;
    } else {
        shareList = studioList;
    }

    
    if (shareList.length > 0) {
        selectedShare = shareList[0];
    }
});

    </script>

    <div class='flex {topOfCommons ? "flex-row" : "flex-col"} {noArtefacts ? "ml-8" : "items-center justify-center mt-2 mb-8"}'>
        <div class='flex {topOfCommons ? "flex-row" : "flex-col"} {noArtefacts ? "" : "items-center justify-center mx-auto"} max-w-4xl w-full'>
            {#if !topOfCommons}
                <Tooltip text="You can choose from any studio you saved in your settings. Settings can be accessed in the server customization in the top left corner and then under 'workspace settings'.">
                    {#if !noArtefacts}
                    <p class='mt-8'>You have reached the Beginning of Studio portals.</p>
                    
                    {:else}
                    <p class='text-left my-4'>proceed to the studio to place your artefact.</p>
                    {/if}
                </Tooltip>
            {/if}
            <div class='flex {topOfCommons ? "flex-row pb-4" : "flex-col w-full pt-8"} items-start {noArtefacts ? "" : "items-center justify-center mx-auto"}'>
                {#if !noArtefacts}
                <label for="share-switcher" class="text-left {topOfCommons ? 'w-full' : 'w-auto mb-4'}">
                    {#if commons}
                    <p>You can travel to an alternative commons</p>
                    {:else}
                    <p>Choose the Studio you want to enter:</p>
                    {/if}    
                </label>
                {/if}
                <select
                    id="share-switcher"
                    bind:value="{selectedShare}"
                    class="form-control truncate ..."
                    on:change={e => { 
                        selectedShare = e.target.value;
                    }}
                >
                    {#each shareList as share (share)}
                        <option value={share}>{share}</option>
                    {/each}
                </select>
                <button class='phase1 my-2 {topOfCommons ? 'w-4/5 ml-4' : 'w-auto mb-24'}' on:click="{updateShareKeypair}">
                    enter {commons ? 'commons' : 'studio'}
                </button>
       
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
            font-size: 1rem;
            margin: 0.25rem;
            padding: 0.75rem 0.75rem;
            border-radius: 0.25rem;
            border: 1px solid #ccc;
        }
    </style>
    