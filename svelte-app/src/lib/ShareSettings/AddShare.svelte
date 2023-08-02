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
      addSecret();
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
    <h4>
      add/remove workspace shares
    </h4>
    <div class='flex flex-col justify-start py-2'>
      <h6 class='text-left py-2'>add shares</h6>
      <div class='flex flex-col lg:flex-row'>
      <label for='shareAddress' style='text-align:left;'>
        Address:
      <input
        id='shareAddress'
        type="text"
        spellcheck="false"
        bind:value
        placeholder="Add a new share address"
      />

    
  
    <label for='shareAddress' style='text-align:left;'>
      Secret:
    <input
    type="text"
    spellcheck="false"
    bind:value={sValue}
    placeholder="Add the secret for this share"
  />

  <div>
    <button class='w-60 phase1 my-4' on:click={() => addShare(value)}> add a share </button> 
  </div>
</div>
  </div>
  

  
    {#if showWarning}
      <p>
        <strong> 
          {errorMsg} 
        </strong>
      </p>
    {/if}
  </div>
  
  
  <style>

  </style>
  