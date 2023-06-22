<script>
  import FileSharing from "./FileSharing.svelte";
  import Voice from "./Voice.svelte";
  import TextInput from "./TextInput.svelte";

  export let grid = [6, 9];

  $: col = `repeat(${grid[1]}, 1fr)`;
  $: row = `repeat(${grid[0]}, 1fr)`;
  $: is_active = Array(grid[0])
    .fill(0)
    .map((_) => Array(grid[1]).fill(false));

  let start = [];
  let clicked = false;
  let fileSelection = false;
  let clickedPos = ["0px", "0px"];

  function selectNupload(i, j) {
    start = [i, j];

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
      {start[1]}, {start[0]}</div>

    <div class="flex-col">
      <TextInput xy={start} on:selected/>
      <FileSharing xy={start} on:selected />
      <Voice xy={start} on:selected/>

      <button class="phase1" on:click={close_modal}>close</button>

    </div>
  </div>
{/if}
<div class="w-4/5">
<h4>Select location on map</h4>

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
</div>
</div>
</div>
<!-- Displays coordinates of selected area 
      <strong>Coords:</strong> {start} {end[0] ? '-' : ''} {end} -->
<style>
  h4 { 
    width:100%;
    margin-top:-5vh;
  }
  .container {
    position: relative;
    display: grid;
    border: 1px solid #999;
    border-radius: 2px;
    width: 78vw;
    height: 78vh;
    grid-gap: 1px;
    background: #999;
    z-index: 98;
  }

  .container div {
    background: #fff;
  }

  .container div:hover {
    background: #fff5d9;
  }

  .container div.active {
    background: #e15f55;
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
</style>
