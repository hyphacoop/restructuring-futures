<script>
    import FileSharing from "./FileSharing.svelte";
    import Voice from "./Voice.svelte";
  
    export let grid = [4, 8];
  
    $: col = `repeat(${grid[1]}, 1fr)`;
    $: row = `repeat(${grid[0]}, 1fr)`;
    $: is_active = Array(grid[0])
      .fill(0)
      .map((_) => Array(grid[1]).fill(false));
  
    let start = [];
    let clicked = false;
    let fileSelection = false;
    let showGrid = true;
  

    export let inStudio;

  
    function selectNupload(i, j) {
      start = [i, j];
  
      clicked = !clicked;
      check_active([i, j]);
      setTimeout(() => {
        fileSelection = true;
        showGrid = false;
      }, 500);
    }
  
    function is_in_range([i, j], [i2, j2]) {
      return (i - start[0]) * (i - i2) <= 0 && (j - start[1]) * (j - j2) <= 0;
    }
  
    function check_active(end) {
      is_active = is_active.map((a, i) =>
        a.map((_, j) => is_in_range([i, j], end))
      );
    }

  </script>
  

    <h3>Upload artifact</h3>
    {#if fileSelection}

      <div class='flex-row'>
        
        <FileSharing xy={start} {inStudio} on:success />
        <Voice xy={start} {inStudio} on:upload />

      </div>

    {/if}
    {#if showGrid}

      <h4>Select location</h4>

      <div
        class="container"
        style="grid-template-rows: {row}; grid-template-columns: {col};"
      >
        {#each { length: grid[0] } as _, i (i)}
          {#each { length: grid[1] } as _, j (j)}
            <div
              class:active={is_active[i][j]}
              on:click={() => selectNupload(i, j)}
              on:keypress={() => selectNupload(i, j)}
            />
          {/each}
        {/each}
      </div>
    {/if}
  <!-- Displays coordinates of selected area 
      <strong>Coords:</strong> {start} {end[0] ? '-' : ''} {end} -->
  <style>
    .container {
      display: grid;
      border: 1px solid #999;
      border-radius: 2px;
      width: 100%;
      height: 100%;
      grid-gap: 1px;
      background: #999;
    }
  
    .container div {
      background: #fff;
      width: 100px;
      height: 100px;
    }

    .container div:hover {
      background: #ccc;
    }
  
    div.active {
      background: orange;
    }

    .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  </style>
  