<script>
import { get } from 'svelte/store';
import settings from "../../store/settings";
import { shares } from "../../store/settings";
import shareKeypair from "../../store/share";

let selectedShare = get(shareKeypair).shareAddress;

shareKeypair.subscribe(value => {
  selectedShare = value.shareAddress;
});

function updateShareKeypair(e) {
  const shareAddress = e.target.value;
  const secret = settings.shareSecrets[shareAddress]; // retrieve the secret
  shareKeypair.set({shareAddress, secret}); // set both shareAddress and secret
}

let shareList = [];

shares.subscribe(value => {
    shareList = [...value]; 
});
</script>

<div>
    <label for="share-switcher">Select Workspace</label>
    <select
        id="share-switcher"
        bind:value="{selectedShare}"
        on:change="{updateShareKeypair}"
        class="form-control"
    >
        {#each shareList as share (share)}
            <option value={share}>{share}</option>
        {/each}
    </select>
</div>

<style>
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
