<script>
    import { get } from "svelte/store";
    import settings from "../../store/settings";
    import shareKeypair from "../../store/share";
  
    let selectedShare = get(shareKeypair).shareAddress;
    shareKeypair.subscribe(value => {
      selectedShare = value.shareAddress;
    });
  
    async function removeShare() {
      if (!selectedShare) return;
      
      const shareAddressToRemove = selectedShare;
  
      await settings.removeShare(shareAddressToRemove);
      
      // After removing, if the removed share was the current one, unset it
      const currentShare = get(shareKeypair).shareAddress;
      if (currentShare === shareAddressToRemove) {
        shareKeypair.set({ shareAddress: null, secret: null });
      }
    }
  </script>
  <div>
    <label for="share-switcher">Remove Workspace</label>
  <select
    id="share-selecter"
    bind:value="{selectedShare}"
    class="form-control"
  >
    {#each settings.shares as share (share)}
      <option value={share}>{share}</option>
    {/each}
  </select>
  
  <button on:click="{removeShare}">
    Remove Share
  </button>
  </div>
<style>
  label {
    display: block;
    margin-bottom: 0.5rem;
}
div {
    text-align: left;
    padding: 0 1rem;
    margin: 0 0.25rem;
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