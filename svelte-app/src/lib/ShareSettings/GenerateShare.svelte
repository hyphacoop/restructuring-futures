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
    // Validate shareName before attempting to generate
    if (!isValidShareName(shareName)) {
      throw new Error("Share name contains invalid characters");
    }

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
        throw new Error("Error adding new workspace keypair");
      }
    }
  } catch (e) {
    console.error(e); // Log the error for debugging
    error = e;
    success = false;
  }
};

const isValidShareName = (name) => {
  // Check the length
  if (name.length < 1 || name.length > 15) {
    return false;
  }

  // Check the first character to ensure it's not a digit
  if (/\d/.test(name[0])) {
    return false;
  }

  // Check if the name contains only valid characters: lowercase letters and numbers
  const regex = /^[a-z0-9]+$/;
  return regex.test(name);
};
</script>
<div>

  <div class='flex flex-col justify-start py-2'>
<h6 class='text-left'>generate new workspace</h6>
<div class='flex flex-col md:flex-row space-between w-auto'>
  
  <input
    class='mr-2'
    id="dbName"
    type="text"
    bind:value={shareName}
    placeholder="Enter share name"
  />
  <div class='mx-2'>
<button class='phase1' on:click={generateNewShareKeypair}>Generate New Workspace Keypair</button>
</div>
  </div>

</div>
 
</div>
{#if error}
  <div class='error-info text-left'>
    <p>Error: {error.message}</p>
    <p>Please ensure the share name meets the following requirements:</p>
    <ul>
      <li>MUST be 1 to 15 characters long, inclusive.</li>
      <li>MUST only contain digits 0-9 and lowercase ASCII letters a-z.</li>
      <li>MUST NOT start with a digit.</li>
    </ul>
  </div>
{:else if success}
  <div class='text-left'>
    <p>Successfully generated new workspace keypair!</p>
    {#if newKeypair}
      <p>{newKeypair.shareAddress}</p>
      <p>{newKeypair.secret}</p>
    {/if}
    <p>This new keypair has been added to your workspace.</p>
  </div>
{/if}

<style>

</style>
