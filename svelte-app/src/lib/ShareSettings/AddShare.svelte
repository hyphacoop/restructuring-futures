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
    let confirmationMsg = false;
    
  
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
      if (!showWarning) {
            confirmationMsg = true;
        }
    }
  
  
    async function addSecret() {
      let testValues = {
        address: value,
        secret: sValue,
      }

      const testIt = await Earthstar.Crypto.checkKeypairIsValid(testValues);
      console.log('share', value, typeof value)
      console.log('secret', sValue, typeof sValue)
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
         if (!showWarning) {
            confirmationMsg = true;
        }
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

    <div class='flex flex-col justify-start py-2'>
      <h6 class='text-left pt-2'>add existing share</h6>
      <div class='flex flex-col lg:flex-row'>
      <label for='shareAddress' style='text-align:left;'>
        Address:
      <input
        id='shareAddress'
        type="text"
        spellcheck="false"
        bind:value
        placeholder="Add a new workspace address"
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
    <button class='w-60 phase1 mt-2 mb-1' on:click={() => addShare(value)}> add a share </button> 
  </div>
</div>
  </div>
  

   {#if confirmationMsg}
        <p class="text-left">
            Share and/or secret successfully added!
        </p>
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

  </style>
  