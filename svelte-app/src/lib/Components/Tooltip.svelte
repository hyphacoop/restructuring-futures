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
  
  <div bind:this={tooltipDiv} class="tooltip">
    {#if showTooltip}
      <div class="tooltiptext">{text}</div>
    {/if}
    <slot></slot>
  </div>
  

  <style>
    .tooltip {
      display: block;
      position: relative;
    }
  
    .tooltiptext {
      visibility: hidden;
      width: auto;
      background-color: var(--dark-text-red);
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px;
      position: absolute;
      z-index: 99;
      top: 110%;
      left: 50%;
      margin-left: -60px;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .tooltip:hover .tooltiptext {
      visibility: visible;
      opacity: 1;
    }
  </style>