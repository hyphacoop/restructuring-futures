<script>
  import * as Earthstar from "earthstar";
  import settings from "../../store/settings";
  import { updateShares } from "../../store/settings";

  let shareName = "";
  let error;
  let success = false;
  let newKeypair;

  const generateNewShareKeypair = async () => {
    try {
      newKeypair = await Earthstar.Crypto.generateShareKeypair(shareName);
      console.log(newKeypair);
      if (settings) {
        const addShareResult = settings.addShare(newKeypair.shareAddress);
        const addSecretResult = settings.addSecret(
          newKeypair.shareAddress,
          newKeypair.secret
        );

        // Check if results are not ValidationErrors
        if (
          typeof addShareResult !== "string" &&
          typeof addSecretResult !== "string"
        ) {
          success = true;
          error = null;
          updateShares(settings.shares);
        } else {
          throw new Error("Error adding new share keypair");
        }
      }
    } catch (e) {
      error = e;
      success = false;
    }
  };
</script>
<div>

  <div class='flex flex-col justify-start py-2'>
<h6 class='text-left'>generate new share</h6>
<div class='flex flex-col md:flex-row space-between w-auto'>
  
  <input
    class='mr-2'
    id="dbName"
    type="text"
    bind:value={shareName}
    placeholder="Enter share name"
  />
  <div class='mx-2'>
<button class='phase1' on:click={generateNewShareKeypair}>Generate New Share Keypair</button>
</div>
  </div>

</div>
 
</div>
{#if error}
  <p>Error: {error.message}</p>
{:else if success}
  <div class='text-left'>
    <p>Successfully generated new share keypair!</p>
    {#if newKeypair}
      <p>{newKeypair.shareAddress}</p>
      <p>{newKeypair.secret}</p>
    {/if}
    <p>This new share has been added to your workspace.</p>
  </div>
{/if}

<style>

</style>
