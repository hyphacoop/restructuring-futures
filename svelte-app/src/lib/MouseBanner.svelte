<script>
    const src = 'images/upload-img.png';
    const repetitions = 7; // number of times the pattern should be repeated
    let cells = Array(repetitions).fill().map(() => ({}));
</script>

<div class="banner">
    {#each cells as cell, i}
        <div class="cell">
            <div class="ml-12 bgimg" style={`background-image: url(${src});`}></div>
        </div>
        <div class="cell"></div>
    {/each}
</div>

<style>
    .banner {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: repeat(auto-fill, minmax(137px, 1fr)); /* replace 137px with your image width */
        height: 78px;
        width: 100vw;
    }
    .cell {
        width: 100%;
    }
    .bgimg {
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        width: 100%;
    }
</style>
