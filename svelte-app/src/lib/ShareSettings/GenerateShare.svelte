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
  <label for="dbName"
    >Generate a new share keypair
    <input
      id="dbName"
      type="text"
      bind:value={shareName}
      placeholder="Enter share name"
    /></label
  >
  <button on:click={generateNewShareKeypair}>Generate New Share Keypair</button>
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
    div {
        text-align: left;
        padding: 1rem;
        margin: 0.25rem;
    }
  input {
    width: 90%;
    height: 1.5rem;
    font-size: 1rem;
    resize: none;
    margin: 0.25rem;
    padding: 1rem 0.75rem;
    text-align: center;
  }
  button {
    width: 90%;
    margin: 0.25rem;
    padding: 0.25rem;
    align-items: flex-end;
    text-align: center;
  }
</style>
