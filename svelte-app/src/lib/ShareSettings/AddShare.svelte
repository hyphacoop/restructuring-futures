<script>
    import * as Earthstar from "earthstar";
    import settings from "../../store/settings";
    import shareKeypair from "../../store/share";
  
    import { onMount } from "svelte";
  
    let value;
    let sValue;
    let showWarning = false;
    let errorMsg = undefined;
    let showSecret = false;
    
  
    function addShare(value) {
      if (Earthstar.isErr(Earthstar.checkShareIsValid(value))) {
        showWarning = true;
        errorMsg = "Not a valid share address";
        return;
      } else {
        showWarning = false;
        settings.addShare(value);
        showSecret = true;
        console.log(
          "You are currently signed in as",
          settings.author || "no-one!"
        );
        console.log("You have", settings.shares.length, "shares");
        console.log("Your shares are", settings.shares);
      }
    }
  
  
    async function addSecret() {
      let testValues = {
        address: value,
        secret: sValue,
      }
      const testIt = await Earthstar.Crypto.checkKeypairIsValid(testValues);
      console.log(value, typeof value)
      console.log(sValue, typeof sValue)
      console.log(testIt)
      if (Earthstar.isErr(testIt)) {
        showWarning = true;
        errorMsg = "Not the right secret for this share.";
        return;
      } else {
        showWarning = false;
        settings.addSecret(value, sValue);
        console.log(
          "You are currently signed in as",
          settings.author || "no-one!"
        );
        console.log("You have", settings.shares.length, "shares");
        console.log("Your shares are", settings.shares);
        console.log('You know the secret to these shares:', settings.shareSecrets);
      }
    }
  
  
    onMount(() => {
      if ($shareKeypair !== undefined) {
        settings.addShare($shareKeypair.shareAddress);
        settings.addSecret($shareKeypair.shareAddress, $shareKeypair.secret);
      }
    });
  </script>
  
  <div>
    <label for='shareAddress' style='text-align:left;'>
      Add an existing share address
    <input
      id='shareAddress'
      type="text"
      spellcheck="false"
      bind:value
      placeholder="Add a new share address"
    />
  
    <button on:click={() => addShare(value)}> Submit address </button>
  
  
    {#if showSecret}
    <input
    type="text"
    spellcheck="false"
    bind:value={sValue}
    placeholder="Add the secret for this share"
  />
  
  <button on:click={() => addSecret()}> Submit address </button>
  {/if}
  
    {#if showWarning}
      <p>
        <strong> 
          {errorMsg} 
        </strong>
      </p>
    {/if}
  </div>
  
  
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
  