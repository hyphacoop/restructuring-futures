<script>
    import { createInvitationURL } from "earthstar";
    import settings from "../../store/settings";
    import QRCode from "../QRJS.svelte";
    import { onMount } from 'svelte';
    
    let squareSize;

    onMount(() => {
      squareSize = window.innerWidth * 0.4;
      window.addEventListener('resize', () => {
        squareSize = window.innerWidth * 0.4;
      });
    });

    let invitationURL = '';
    let copySuccess = false;
    let showQR = false;
  
    export let shareAddress;
  
    let shareDetails;
  
    async function generateInvitationURL() {
      // generate the invitation url
      const result = await createInvitationURL(shareAddress, settings.servers, settings.shareSecrets[shareAddress]);
      
      // check if the result is an error
      if (typeof result === 'string') {
        invitationURL = result;
      } else {
        console.error('Failed to create invitation URL:', result);
      }
    }

    async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(invitationURL);
      copySuccess = true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  function toggleQR() {
    showQR = !showQR;
  }
  function handleClickOutside(event) {
      if(event.target.id === 'modal') {
          showQR = false;
      }
    }
  </script>
  
  <div>
    <button class='phase1 w-60' on:click={generateInvitationURL}>generate invitation url</button>
    {#if invitationURL}
      <p class="py-2"><strong>Your invitation URL is: </strong>
        <span class='break-all text-xs'>{invitationURL}</span>
      </p>
    {#if !copySuccess}
      <button on:click={copyToClipboard}>Copy URL to clipboard</button>
      {:else}
      <button on:click={copyToClipboard}>URL copied to clipboard!</button>
      {/if}
      <button class='mt-2' on:click={toggleQR}>
        
        {#if showQR}
          Hide
        {:else}
        Show 
        {/if}
        QR code
      </button>
      {#if showQR}
      <div id="modal" on:click={handleClickOutside}>
        <div id="qrcodeContainer">
          <QRCode codeValue={invitationURL} {squareSize} />
        </div>
      </div>
        {/if} 
    {/if}
  </div>
  <style>

    #modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.5);
    }
    #qrcodeContainer {
      position: relative;
      z-index: 10;

      height: 80vh;
      background-color: white;
    }
  </style>