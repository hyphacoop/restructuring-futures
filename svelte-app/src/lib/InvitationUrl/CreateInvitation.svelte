<script>
    import { createInvitationURL } from "earthstar";
    import sharedSettings from "../../store/settings";
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
  
    // get the current shared settings and share keypair
    let settings;
    sharedSettings.subscribe(value => {
      settings = value.settings;
    });
  
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
        <span class='break-all'>{invitationURL}</span> {#if copySuccess}
        <span><strong>URL copied to clipboard!</strong></span>
      {/if}</p>
      <button on:click={copyToClipboard}>Copy URL to clipboard</button>
     
      <button on:click={toggleQR}>
        
        {#if showQR}
          Hide
        {:else}
        Show 
        {/if}
        QR code
      </button>
      {#if showQR}
      <div id="qrcodeContainer" class="ml-1/5">
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