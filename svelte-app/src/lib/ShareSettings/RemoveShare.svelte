<script>
  import { get } from "svelte/store";
  import { shares, removeShare } from "../../store/settings";
  import shareKeypair from "../../store/share";

  let selectedShare = get(shareKeypair).shareAddress;
  let removalStatus = '';

  shareKeypair.subscribe(value => {
    selectedShare = value.shareAddress;
  });

  async function handleRemoveShare() {
    if (!selectedShare) return;
    
    const shareAddressToRemove = selectedShare;

    removeShare(shareAddressToRemove);

    // Update the removal status
    removalStatus = `Share ${shareAddressToRemove} has been removed.`;
  
    // After removing, if the removed share was the current one, unset it
    const currentShare = get(shareKeypair).shareAddress;
    if (currentShare === shareAddressToRemove) {
      shareKeypair.set({ shareAddress: null, secret: null });
    }
  }

  $: shares; // subscribe to changes in shares

</script>
<div>
<label for="share-switcher">Remove Share / Workspace</label>
<select id="share-selecter" bind:value="{selectedShare}" class="form-control">
  {#each $shares as share (share)}
    <option value={share}>{share}</option>
  {/each}
</select>
<p>{removalStatus}</p>
<button on:click="{handleRemoveShare}">
  Remove Share
</button>
</div>
<style>
  label {
    display: block;
}
div {
    text-align: left;
    padding: 0 1rem;
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
button {
    width: 90%;
    margin: 0.25rem;
    padding: 0.25rem;
    align-items: flex-end;
    text-align: center;
}
</style>