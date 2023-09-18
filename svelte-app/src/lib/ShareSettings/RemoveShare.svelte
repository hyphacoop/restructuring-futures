<script>
  import { get } from "svelte/store";
  import { shares, removeShare } from "../../store/settings";
  import shareKeypair from "../../store/share";
  import settings from "../../store/settings";

  // Derived store to get shares excluding the current share
  import { derived } from "svelte/store";
  const availableShares = derived([shares, shareKeypair], ([$shares, $shareKeypair]) => 
    $shares.filter(share => share !== $shareKeypair.shareAddress)
  );

  let selectedShare = get(shareKeypair).shareAddress;
  let removalStatus = '';
  let userInput = '';
  let showModal = false;
  let sharePart;

  shareKeypair.subscribe(value => {
    selectedShare = value.shareAddress;
  });

  $: sharePart = selectedShare.split('+')[1].split('.')[0];

  function handleRemoveShare() {
    // display the modal
    showModal = true;
  }
  function handleConfirmRemoveShare() {
    // if user input matches the substring, remove the share
    if (userInput === sharePart) {
      removeShare(selectedShare);

      // Update the removal status
      removalStatus = `Share ${selectedShare} has been removed.`;
  
      // After removing, if the removed share was the current one, unset it
      const currentShare = get(shareKeypair).shareAddress;
      if (currentShare === selectedShare) {
        shareKeypair.set({ shareAddress: null, secret: null });
      }
    } else {
      removalStatus = `The share could not be removed. <br>Please type the name of the share you want to remove.<br>This is the section between the '+' and '.'`;
    }

    // clear the user input and close the modal
    userInput = '';
    showModal = false;
  }
  function handleCancel() {
    // clear the user input and close the modal
    userInput = '';
    showModal = false;
  }
  $: shares; // subscribe to changes in shares

</script>
<div class='flex flex-col justify-start py-6'>
<h6 class='text-left'>remove shares</h6>
<label class='text-left' for="share-switcher">this action is irreversible</label>
<div class='flex flex-col 2xl:flex-row'>
<select id="share-selecter" bind:value="{selectedShare}" class="form-control my-2 w-3/5">
  {#each $availableShares as share (share)}
    <option value={share}>{share}</option>
  {/each}
</select>

<button class='phase1 w-2/5 m-2'on:click="{handleRemoveShare}">
  remove share
</button>

</div>
<p class='text-left'>{@html removalStatus}</p>
</div>


{#if showModal}
<div class="modal">
  <div class="modal-content w-2/3 lg:w-2/5">
    <div class='flex flex-col justify-start'>
    <h5 class='text-left'>removing the following share from your workspace:</h5>
    <p class='pt-2 text-left truncate ...'><b>
      Address:
    </b>{selectedShare}<br></p>
    <p class='pb-2 text-left truncate ...'>
    <b>Secret:</b>
    {settings.shareSecrets[selectedShare]}<br>
</p>
    <h6 class='text-left'>type the name of this share to remove it from your browser's memory</h6>

    <div class='flex flex-col py-2'>
    <p class=' truncate ...'>+
      <input type="text" bind:value={userInput} placeholder="{sharePart}">
      .{selectedShare.split('.')[1]}
    </p>
    <div class='flex flex-row justify-between'>
    <button class='py-2 m-4' on:click="{handleConfirmRemoveShare}">remove this share</button>
    <button class='py-2 m-4' on:click="{handleCancel}">cancel</button>
    </div>
  </div>    
  </div>
  </div>
  </div>

{/if}

<style>

  input {
    width:50%;
  }
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
  }

  .modal-content {
    background-color: var(--paper-yellow);
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
  }
</style>