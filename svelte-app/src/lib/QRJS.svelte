<script>
    import { onMount, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    import QRCode from 'qrcode';
      export let codeValue;
      export let squareSize; 
      
      let qrCodeContainer;
    let qrCodeCanvas;

    onMount(async () => {
        qrCodeCanvas = await QRCode.toCanvas(codeValue, {
            width: squareSize,
            small: true,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        qrCodeContainer.appendChild(qrCodeCanvas);
    });

    onDestroy(() => {
        // Cleanup QR Code canvas on component destroy
        qrCodeCanvas && qrCodeCanvas.remove();
    });
  </script>
  
  
  <div id="qrcode" bind:this={qrCodeContainer} in:fade={{duration: 300}}></div>
  