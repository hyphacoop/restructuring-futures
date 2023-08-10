<script>
    import { shares } from "../../store/settings";
    import settings from "../../store/settings";
     import DownloadTool from "../DownloadTool.svelte";

    import CreateInvitation from "../InvitationUrl/CreateInvitation.svelte";

    let shareList = [];
    let tooltipStates = {};

    function showShareTooltip(share) {
        tooltipStates[share] = true;
        setTimeout(() => tooltipStates[share] = false, 2000);
}
    
    shares.subscribe(value => {
        shareList = [...value]; 
        value.forEach(share => tooltipStates[share] = false);
    });

    $: console.log('shareList', shareList);
    $: console.log('shareSecrets', settings.shareSecrets);

</script>
<div class='flex flex-col items-start'>
{#if shareList.length > 0}
{#each shareList as share (share)}
    <div class="flex flex-col items-start py-2">
        <p>
            <b>Address:</b>
            {share}
        </p>
        <p>
            <b>Secret:</b>
            {settings.shareSecrets[share]}
        </p>
        <p>
            <b>Type:</b>
            {share.includes('commons') ? 'Commons' : 'Studio'}
        </p>
        <div class='flex flex-row items-end'>
        <div class="mt-4 mx-2">
            <CreateInvitation shareAddress={share} />
        </div>
        <div class="mt-4 mx-2">
            <button class="phase1 tooltip" on:click={() => {
                navigator.clipboard.writeText(share);
                showShareTooltip(share);
            }}>
                copy address
                <span class="tooltiptext" class:visible={tooltipStates[share]}>address copied </span>

            </button>
        </div>
        <div class="mt-4 mx-2">
            <button class="phase1 tooltip" on:click={() => {
                navigator.clipboard.writeText(settings.shareSecrets[share]);
                showShareTooltip(share);
            }}>
                copy secret
                <span class="tooltiptext" class:visible={tooltipStates[share]}>secret copied</span>

            </button>
        </div>
        <div class="mt-4 mx-2">
        <DownloadTool shareAddress={share} />
    </div>
    </div>
        <hr class="divider w-full mt-4 mb-2">
    </div>

{/each}
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