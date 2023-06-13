<script>
    import { parseInvitationURL } from 'earthstar';
    import sharedSettings from "../../store/settings";
    
    let invitationURL = '';
    let parsedInvitation;
    let error;
    let settings;
    let success = false;
  

     // Subscribe to the sharedSettings store to get the SharedSettings instance
    sharedSettings.subscribe(value => {
    settings = value.settings;
    });

    const parseURL = async () => {
      try {
        parsedInvitation = await parseInvitationURL(invitationURL);
        console.log(invitationURL);
        console.log(parsedInvitation);
        error = null;
        success = false;
        return true;
      } catch (e) {
        error = e;
        console.log(e);
        return false;
      }
    };

    const redeemURL = async () => {
    try {
      const response = await settings.redeemInvitationURL(invitationURL);
      if (response === true) {
        success = true;
        error = null;
      } else {
        error = response;
        success = false;
      }
    } catch (e) {
      error = e;
      success = false;
    }
  };

  const processURL = async () => {
    if (await parseURL()) {
      await redeemURL();
    }
  };
  </script>
  
  <input type="text" bind:value={invitationURL} placeholder="Enter invitation URL" />
  <button on:click={processURL}>Redeem Invitation URL</button>
  {#if error}
    <p>Error: {error.message}</p>
    {:else if success}
  <p>Successfully redeemed invitation!</p>
  {:else if parsedInvitation}
    <p>Parsed Invitation:</p>
    <pre>{JSON.stringify(parsedInvitation, null, 2)}</pre>
  {/if}
  