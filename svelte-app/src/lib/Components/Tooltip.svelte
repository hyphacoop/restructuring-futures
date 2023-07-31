<script>
    import { onMount } from 'svelte';
    let tooltipDiv;
    export let text = '';
    let showTooltip = false;
    
    let position = { top: 0, left: 0 };
    
    onMount(() => {
      tooltipDiv.addEventListener('mouseover', () => { showTooltip = true; });
      tooltipDiv.addEventListener('mouseout', () => { showTooltip = false; });
    });
  </script>
  
  <div bind:this={tooltipDiv} style="position: relative;">
    <slot></slot>
    {#if showTooltip}
      <div style="position: absolute; top: 10px; left: 10px; background: lightgray; padding: 10px; border-radius: 5px; z-index: 1;">
        {text}
      </div>
    {/if}
  </div>
  