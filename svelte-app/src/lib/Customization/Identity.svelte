<script>
  import * as Earthstar from "earthstar";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  import authorKeypair from "../../store/identity.js";
  import settings from "../../store/settings.js";

  import UploadId from "../UploadId.svelte";

  let value;
  let error;
  let showWarning = false;
  let newAlias;
  let uploadWarning = false;
  let editing = false;

  // download identity file as json
  function Download() {
    let element = document.createElement("a");
    let file = new Blob([JSON.stringify($authorKeypair)], {
      type: "text/plain",
    });
    let filename = $authorKeypair.address + ".json";
    element.href = URL.createObjectURL(file);
    element.download = filename;
    element.style.display = "none";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  // function to check if string starts with a number
  function isNumber(str) {
    return /[0-9]/.test(str);
  }

  function isSpecialChar(str) {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
  }

  // Function to generate a 4 char pseudo-random ID
  function RandomId() {
    let result = "";
    let alphaCharacter = "abcdefghijklmnopqrstuvwxyz";
    let alphaLength = alphaCharacter.length;
    let allCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let allLength = allCharacters.length;
    result += alphaCharacter.charAt(Math.floor(Math.random() * alphaLength));
    for (let i = 0; i < 3; i++) {
      result += allCharacters.charAt(Math.floor(Math.random() * allLength));
    }
    return result;
  }

  // Create a new author keypair from the alias.
  export async function generateID(r) {
    if (r == "r") {
      value = RandomId();
    }
    let firstChar = value.slice(0, 1);
    if (isNumber(firstChar)) {
      console.log("firstChar", firstChar);
      error = "ID must start with a letter";
    } else if (value.length !== 4) {
      error = "ID must be 4 characters long";
    } else if (isSpecialChar(value)) {
      error = "ID must not contain special characters";
    } else {
      let identityKeypair = await Earthstar.Crypto.generateAuthorKeypair(value);
      // @ts-ignore
      let authorAddress = identityKeypair.address;
      // @ts-ignore
      let authorSecret = identityKeypair.secret;

      authorKeypair.set({
        address: authorAddress,
        secret: authorSecret,
      });
      error = null;
      showWarning = false;

      settings.author = identityKeypair;
    }
  }

  function handleAlias(event) {
    console.log("event", event);
    newAlias = event.detail;
    value = newAlias;
    uploadWarning = false;
  }

  function handleError() {
    uploadWarning = true;
  }
  $: currentAddress = $authorKeypair.address;
  $: currentSecret = $authorKeypair.secret;
  $: currentAlias = currentAddress.slice(0, 5);
  $: value = currentAlias.slice(1, 5);

  onMount(async () => {
    if (settings.author) {
      // if an author already exists, use it
      authorKeypair.set(settings.author);
    } else {
      // if no author exists, generate a new one
      generateID("r");
    }
  });

  function handleEdit() {
    editing = !editing;
  }
</script>

<div class="w-full text-left">
  <div class="flex flex-col items-start pb-24">
    <div class="w-4/5 lg:w-3/5 flex flex-row justify-between items-end">
      <div class="flex flex-col">
        <h3>manage alias</h3>
        <h4 class="my-4">
          <b>Your current alias: </b>
          {#if editing}
            <div>
              <input
                class="w-auto lg:w-2/3"
                type="text"
                spellcheck="false"
                maxlength="4"
                bind:value
                on:keypress={() => {
                  showWarning = true;
                }}
                on:focus={() => {
                  showWarning = true;
                }}
                on:keypress={() => generateID()}
              />
            </div>
          {:else}
            <br />{currentAlias}
          {/if}
        </h4>
      </div>

      <div class="my-4 flex flex-row h-1/3">
        <button class="phase1 w-auto lg:w-11/12 mx-4" on:click={handleEdit}>
          edit current alias
        </button>
        <button class="phase1 w-auto lg:w-11/12" on:click={generateID}>
          change alias
        </button>
      </div>
    </div>
    <div class="w-4/5 lg:w-3/5 flex flex-row justify-between">
        <div class='text-left flex-grow'>
            {#if showWarning}
            <blockquote in:fly={{ y: 50, duration: 2000 }}>
              {#if error === "ID must be 4 characters long"}
                <i>
                  A valid id <strong>needs to be 4 characters long</strong>.
                </i>
              {:else if error === "ID must start with a letter"}
                <i>
                  <strong>A valid alias must begin with a letter.</strong> It needs to
                  be 4 characters long and can only contain letters and numbers.
                </i>
              {:else if error === "ID must not contain special characters"}
                <i>
                  <strong> Special characters are not allowed. </strong>
                  <br />
                </i>
              {:else}
                Press enter or click on <b>Change alias</b> to generate a new keypair.
              {/if}
            </blockquote>
          {/if}
          {#if uploadWarning === true}
            <blockquote transition:fly={{ y: 200, duration: 2000 }}>
              <strong>Please upload a valid identity file</strong>
            </blockquote>
          {/if}
        </div>
      <div>
        <UploadId
          on:alias={handleAlias}
          on:error={handleError}
          identityPg={true}
        />
      </div>
    </div>
    <div class="w-4/5 lg:w-3/5">
      Your alias (the identity you assume on this platform when interacting with
      others) is represented by the keypair seen below. It contains an address
      and a secret. If you intend on using the same alias consistently, it is
      important that you save your keypair safe in folder offline. Workspaces
      you have been invited to may be tied to your alias. Always keep a backup
      of all keypairs of your workspaces and aliases.
    </div>
    <div class="my-6">
      <div>
        <b> Address: </b>
        {currentAddress}
        <br />
        <b> Secret: </b>
        {currentSecret}
      </div>
    </div>
    <div class="mt-4 flex items-start align-left flex-col">
      <button class="phase1 w-auto lg:w-11/12" on:click={() => Download()}>
        download your current alias in .JSON
      </button>

      <!-- Removing upload button since it is now on the main page
           
    -->
    </div>

    <div>
      <div>
        <h5 class="mt-12"><b>generate a new alias</b></h5>

        <div class="w-auto">You can always assume a new identity.</div>

        <button class="phase1 my-4" on:click={() => generateID("r")}>
          generate alias
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  input {
    font-family: Gap_sansregular, Impact, Haettenschweiler, "Arial Narrow Bold",
      sans-serif;
    line-height: 1;
    font-size: var(--font-size-lg);
  }
</style>
