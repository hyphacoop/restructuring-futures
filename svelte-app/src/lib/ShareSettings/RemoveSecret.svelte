<script>
    import { get } from "svelte/store";
    import { shares, removeSecret } from "../../store/settings";
    import shareKeypair from "../../store/share";
    import settings from "../../store/settings";
    
    let selectedShare;
    let removalStatus = '';
    let userInput = '';
    let showModal = false;
    let sharePart;

    $: sharePart = selectedShare.split('+')[1].split('.')[0];
  
    shareKeypair.subscribe(value => {
      selectedShare = value.shareAddress;
    });
  
  
    function handleRemoveSecret() {
      showModal = true;
    }
  
    function handleConfirmRemoveSecret() {
      if (userInput === sharePart) {
        removeSecret(selectedShare);
  
        removalStatus = `Secret ${selectedShare} has been removed.`;
    
        // After removing, if the removed secret was the current one, unset it
        const currentSecret = get(shareKeypair).shareAddress;
        if (currentSecret === selectedShare) {
          console.log('you should warn the user that the current secret has been removed');
          shareKeypair.set({ shareAddress: null, secret: null });
        }
      }
  
      userInput = '';
      showModal = false;
    }
  
    function handleCancel() {
      userInput = '';
      showModal = false;
    }
  
    $: shares;
  </script>
  
  <div class='flex flex-col justify-start py-6'>
    <h6 class='text-left'>remove secrets</h6>
    <div></div>
   
    <div class='flex flex-col 2xl:flex-row'>
      <label class='text-left' for="secret-switcher">this action is irreversible</label>
      <select id="secret-selecter" bind:value="{selectedShare}" class="form-control my-2 w-3/5">
        {#each $shares as share (share)}
          <option value={share}>{share}</option>
        {/each}
      </select>
  
      <button class='phase1 w-2/5 m-2' on:click="{handleRemoveSecret}">
        remove secret
      </button>
    </div>
    <p>{removalStatus}</p>
  </div>
  
  {#if showModal}
  <div class="modal">
    <div class="modal-content w-2/3 lg:w-2/5">
      <h5 class='text-left py-2'>removing the following secret:</h5>
      <div class='text-left py-2'>
      <p><b>Secret:</b> {selectedShare}</p>
        </div>
      <h6 class='text-left'>type the value of this secret to remove it from your browser's memory</h6>
  
      <div class='flex flex-col py-2'>
        <input type="text" bind:value={userInput} placeholder="{sharePart}">
        <div class='flex flex-row justify-between pt-6'>
          <button on:click="{handleConfirmRemoveSecret}">remove this secret</button>
          <button on:click="{handleCancel}">cancel</button>
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
  }  </style>
  