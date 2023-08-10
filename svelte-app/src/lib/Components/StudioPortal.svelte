<script>
    import { get } from 'svelte/store';
    import settings from "../../store/settings";
    import { studioShares } from "../../store/settings";
    import shareKeypair from "../../store/share";
    import Tooltip from "./Tooltip.svelte"; 

    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

    let selectedShare;
    
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

    $: if (shareList.length > 0) {
        selectedShare = shareList[0];  // Set selectedShare to the first item if it's not already set
    }

    </script>
    <div class='flex flex-col items-center justify-center'>
        <div class='flex flex-col items-center justify-center max-w-3xl mx-auto w-full md:w-1/2'>
            <Tooltip text="You can choose from any studio you saved in your settings. Settings can be accessed in the server customization in the top left corner and then under 'workspace settings'.">
                <p>You have reached the Beginning of Studio portals. <br>Choose the Studio you want to enter:</p>
            </Tooltip>
                <label for="share-switcher" class="text-center">Select Workspace</label>
                <select
                    id="share-switcher"
                    bind:value="{selectedShare}"
                    class="form-control"
                >
                    {#each shareList as share (share)}
                        <option value={share} selected={share === selectedShare}>{share}</option>
                    {/each}
                </select>
                <button class='phase1 my-2 mb-24' on:click="{updateShareKeypair}">enter selected studio</button>
        </div>
    </div>
    <style>
        p {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
        label {
            display: block;
        }
        div {
            text-align: left;
            padding: 1rem;
            margin: 0.25rem;
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
    