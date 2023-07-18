<script>
    import { createInvitationURL } from "earthstar";
    import settings from "../../store/settings";
    import shareKeypair from "../../store/share";
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
  

  
    let shareDetails;
    shareKeypair.subscribe(value => {
      shareDetails = value;
    });
  
    async function generateInvitationURL() {
      // generate the invitation url
      const result = await createInvitationURL(shareDetails.shareAddress, settings.servers, shareDetails.secret);
      
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

  </script>
  
  <div>
    <button on:click={generateInvitationURL}>Generate Invitation URL</button>
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
      <div id="qrcodeContainer" class="ml-1/5 mb-12">
        <QRCode codeValue={invitationURL} {squareSize} />
      </div>
        {/if} 
    {/if}
  </div>
  <style>
    #qrcodeContainer {
      position: absolute;
      left:20vw;
      bottom: 0;
      width: 80vw;
      height: 80vh;
      background-color: white;
    }
  </style>