<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let windowWidth;
    let grid, col, row, is_active;

    $: {
        if (windowWidth <= 768) {
            grid = [18, 3];
        } else {
            grid = [6, 9];
        }
        col = `repeat(${grid[1]}, 1fr)`;
        row = `repeat(${grid[0]}, 1fr)`;
        is_active = Array(grid[0]).fill(0).map((_) => Array(grid[1]).fill(false));
    }

    let start = [];
    let clicked = false;

    function selectNupload(i, j) {
        start = [i, j];
        clicked = !clicked;
        check_active([i, j]);
        dispatch('selected', start); // Emitting the selected cell coordinates
    }

    function is_in_range([i, j], [i2, j2]) {
        return (i - start[0]) * (i - i2) <= 0 && (j - start[1]) * (j - j2) <= 0;
    }

    function check_active(end) {
        is_active = is_active.map((a, i) => a.map((_, j) => is_in_range([i, j], end)));
    }

    function mapNumberToLetter(num) {
        return String.fromCharCode(65 + num);
    }
</script>

<div style="position: fixed; z-index: 52;" class="mt-12 pt-2">
    <div class="container" style="grid-template-rows: {row}; grid-template-columns: {col};">
        {#each { length: grid[0] } as _, i (i)}
            {#each { length: grid[1] } as _, j (j)}
                <div
                    class:active={is_active[i][j]}
                    on:click={() => selectNupload(i, j)}
                    style="display: flex; justify-content: center; align-items: center; height: 100%;">
                    {mapNumberToLetter(j)}, {i+1}
                </div>
            {/each}
        {/each}
    </div>
</div>

<style>
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
  }

  .container div:hover {
    background: #fff5d9;
  }

  .container div.active {
    background: #e15f55;
  }
</style>
