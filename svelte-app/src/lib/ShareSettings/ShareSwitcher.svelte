<script>
import { get } from 'svelte/store';
import settings from "../../store/settings";
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
</script>

<div>
    <label for="share-switcher">Select Workspace</label>
    <select
        id="share-switcher"
        bind:value="{selectedShare}"
        on:change="{updateShareKeypair}"
        class="form-control"
    >
        {#each settings.shares as share (share)}
            <option value={share}>{share}</option>
        {/each}
    </select>
</div>

<style>
    label {
        display: block;
        margin-bottom: 0.5rem;
    }
    div {
        text-align: left;
        padding: 1rem;
        margin: 0.25rem;
    }
    select {
        width: 100%;
        padding: 0.5rem;
        font-size: 1rem;
        border-radius: 0.25rem;
        border: 1px solid #ccc;
        margin-bottom: 1rem;
    }
</style>
