<script>
    import { slide } from 'svelte/transition';

    import { shares, secrets } from "../../store/settings";
    import settings from "../../store/settings";
    import { statusStore } from "../../store/status";
    import DownloadTool from "../DownloadTool.svelte";

    import CreateInvitation from "../InvitationUrl/CreateInvitation.svelte";
    import StatusPanel from "./StatusPanel.svelte";
    import StudioPortal from './StudioPortal.svelte';

    let shareList = [];
    let tooltipStates = {};
    let tooltipTimers = {};

    let showItems = true;

    const defaultStudio = import.meta.env.VITE_STUDIO_SHARE_ADDRESS;
    const defaultCommons = import.meta.env.VITE_COMMONS_ADDRESS;

    function showShareTooltip(share, type) {
         // Clear any existing timers for this share
    if (tooltipTimers[share]) {
        clearTimeout(tooltipTimers[share]);
    }

    tooltipStates[share] = type;

    tooltipTimers[share] = setTimeout(() => {
        tooltipStates[share] = null;
    }, 2000);
}
    
    shares.subscribe(value => {
        shareList = [...value]; 
        value.forEach(share => tooltipStates[share] = false);
    });
/* 
    $: console.log('shareList', shareList);
    $: console.log('shareSecrets', settings.shareSecrets);
 */
</script>

<div class='flex flex-row items-start'>
    
    <div>
        <StudioPortal commons={true} topOfCommons={true} on:shareUpdated />
    </div>
</div>
<button 
      class='{showItems ? "phase1" : "phase2"}' 
      on:click={() => showItems = !showItems}
      >
      {#if showItems}
        hide list
      {:else}
        show list
      {/if}
    </button>

<div class='flex flex-col items-start'>
    {#if showItems}
    <div transition:slide|local>
    {#if shareList.length > 0}
    {#each shareList as share (share)}
        <div class="flex flex-col items-start py-2">
            <div class="flex flex-row justify-between">
                <div class="flex flex-col items-start py-2">

            <p>
                <b>Address:</b>
                {share}
            </p>
            {#if $secrets[share]}
                <p>
                    <b>Secret:</b>
                    {$secrets[share]}
                </p>
            {/if}
            <p>
                <b>Type:</b>
                {share.includes('commons') ? 'Commons' : 'Studio'}
                {share === defaultStudio || share === defaultCommons ? ' (default)' : ''}
            </p>
            </div>
            {#if $statusStore}
                {#key share}
                    {#if $statusStore[share]}
                        {#if $statusStore[share].docs}
                            {#if Object.keys($statusStore[share].docs).length > 0}        
                            <div class="ml-16">
                                <StatusPanel shareID={share} />
                            </div>
                            {/if}
                        {/if}
                    {/if} 
                {/key}
            {/if}
        </div>
            <div class='flex flex-row items-end'>
            <div class="mt-4 mx-2">
                <CreateInvitation shareAddress={share} />
            </div>
            <div class="mt-4 mx-2">
                <button class="phase1 tooltip" on:click={() => {
                    navigator.clipboard.writeText(share);
                    showShareTooltip(share, 'address');
                }}>
                    copy address
                    <span class="tooltiptext" class:visible={tooltipStates[share] === 'address'}>address copied </span>

                </button>
            </div>
            <div class="mt-4 mx-2">
                <button class="phase1 tooltip" on:click={() => {
                    navigator.clipboard.writeText(settings.shareSecrets[share]);
                    showShareTooltip(share, 'secret');
                }}>
                    copy secret
                    <span class="tooltiptext" class:visible={tooltipStates[share] === 'secret'}>secret copied</span>

                </button>
            </div>
            <div class="mt-4 ml-16">

                <DownloadTool shareAddress={share} />
            </div>

        </div>
            <hr class="divider w-full mt-4 mb-2">
        </div>

    {/each}
    {/if}
    </div>
    {/if}
</div>
<style>
hr.divider {
    border-top: 1px solid black;
}

.tooltip {
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden; /* Initial state, will be overridden by reactive variable */
  width: 120px;
  background-color: var(--dark-text-red);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  top: 110%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip .tooltiptext.visible {
    visibility: visible;
    opacity: 1;
}
</style>