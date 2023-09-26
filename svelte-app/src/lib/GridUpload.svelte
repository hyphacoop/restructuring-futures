<script>
  import FileSharing from "./FileSharing.svelte";
  import Voice from "./Voice.svelte";
  import TextInput from "./TextInput.svelte";
  import { studioGridStore } from '../store/GridState.js';


  export let windowWidth;
  export let pages;

  let grid;
  let col;
  let row;
  let is_active;
  let start = [];
  let clicked = false;
  let fileSelection = false;
  let clickedPos = ["0px", "0px"];
  let selectedPage = pages && pages[0] && pages[0].pageNumber;

  let currentOccupiedGrid = [];
  $: {
    if ($studioGridStore[selectedPage]) {
      currentOccupiedGrid = $studioGridStore[selectedPage];
  } else {
      currentOccupiedGrid = Array(grid[0]).fill(0).map(() => Array(grid[1]).fill(false));
  }
  //console.log("Current Occupied Grid for Page ", selectedPage, ":", currentOccupiedGrid);
}

  $: {
    if (windowWidth <= 768) {
      // Assuming you want a 3x18 grid for mobile view
      grid = [18, 3];
    } else {
      // Standard 6x9 grid for larger screens
      grid = [6, 9];
    }

    col = `repeat(${grid[1]}, 1fr)`;
    row = `repeat(${grid[0]}, 1fr)`;
    is_active = Array(grid[0])
      .fill(0)
      .map((_) => Array(grid[1]).fill(false));
  }

  function selectNupload(i, j) {
    start = [i, j, selectedPage];

    clicked = !clicked;
    check_active([i, j]);
    setTimeout(() => {
      fileSelection = true;

      // Save clicked div position in pixel
      clickedPos = [(i * 50) + 'px', (j * 50 + 50) + 'px'];
    }, 500);
  }

  $: modalStyle = `top: ${clickedPos[0]}; left: ${clickedPos[1]}; visibility: ${
    fileSelection ? "visible" : "hidden"
  };`;

  function is_in_range([i, j], [i2, j2]) {
    return (i - start[0]) * (i - i2) <= 0 && (j - start[1]) * (j - j2) <= 0;
  }

  function check_active(end) {
    is_active = is_active.map((a, i) =>
      a.map((_, j) => is_in_range([i, j], end))
    );
  }
  function mapNumberToLetter(num) {
    return String.fromCharCode(65 + num);
}

  function close_modal() {
  fileSelection = false;
  // Reset the active selection
  is_active = Array(grid[0]).fill(0).map((_) => Array(grid[1]).fill(false));
}
</script>
<div style="position:fixed;">
<div style="position: relative; z-index:52;">
{#if fileSelection}
  <div class="modal pb-6 " style={modalStyle}>
    <div class="mt-6 brown text-left px-6">What artefact would you like to create? 
      <br>
      {mapNumberToLetter(start[1])}, {start[0] + 1}</div>

    <div class="flex-col">
      <TextInput xy={start} on:selected/>
      <FileSharing xy={start} on:selected />
      <Voice xy={start} on:selected/>

      <button class="phase1" on:click={close_modal}>close</button>

    </div>
  </div>
{/if}
<div class="pb-32 background-white">
<h4 class='py-6'>Select page   <span class="inline-dropdown">
  <select bind:value={selectedPage} id="pageDropdown">
    {#each pages as page}
      <option value={page.pageNumber}># {page.pageNumber}</option>
    {/each}
  </select>
</span>
then location on map</h4>

<div
  class="container mt-8"
  style="grid-template-rows: {row}; grid-template-columns: {col};"
>
{#each Array(grid[0]).fill() as _, i (i)}
   {#each Array(grid[1]).fill() as _, j (j)}
      <div
        class:active={is_active[i][j]}
        class:occupied={currentOccupiedGrid[i] && currentOccupiedGrid[i][j]}
        on:click={currentOccupiedGrid[i] && currentOccupiedGrid[i][j] ? undefined : () => selectNupload(i, j)}
        on:keypress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (!(currentOccupiedGrid[i] && currentOccupiedGrid[i][j])) {
                    selectNupload(i, j);
                }
            }
        }}
        style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        "
      >
      {#if !(currentOccupiedGrid[i] && currentOccupiedGrid[i][j])}
        {mapNumberToLetter(j)}, {i+1}
      {/if}      
    </div>
    {/each}
  {/each}
</div>
</div>
</div>
</div>

<style>
  h4 { 
    width:100%;
    position: absolute;
    bottom: 100%;
    line-height:1.5;
    text-align:left;
    background-color:white;
  }
  .container {
    position: relative;
    display: grid;
    border: 1px solid #999;
    border-radius: 2px;
    width: 78vw;
    height: 80vh;
    grid-gap: 1px;
    background: #999;
    z-index: 98;
  }

  .container div {
    background: #fff;
    transition: background-color 0.3s;
  }

  .container div:hover:not(.occupied) {
      background: #fff5d9;
  }

  .container div.active {
    background: #e15f55;
  }

  .container div.occupied {
    position: relative;
    cursor: not-allowed;
}

.container div.occupied::before,
.container div.occupied::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    background: red;
    transition: all 0.3s;
}

.container div.occupied::before {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    width: 110%; /* adjust based on desired look */
}


  .modal {
    margin-left:-10%;
    position: absolute;
    width: 200px;
    background-color: #fff; 
    border: 1px solid #71302B;
    z-index:99;
  }
  .brown {
    color: #71302B;
  }
  .background-white {
    background-color: #fff;
  }

  .inline-dropdown select {
  background: transparent;
  border: 1px solid #71302B;
  padding:0.5rem 1rem;
  line-height: inherit;
  outline: none;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  cursor: pointer;
}

.inline-dropdown select:hover, .inline-dropdown select:focus {
  background-color: rgba(255, 255, 255, 0.2);
}

</style>
