<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let images = [
        "icons/mountain-phase-0-02.png",
        "icons/mountain-phase-1-02.png",
        "icons/mountain-phase-2-02.png",
        "icons/mountain-phase-3-02.png",
        "icons/mountain-phase-4-02.png",
        "icons/mountain-phase-5-02.png",
        "icons/mountain-phase-6-02.png",
        "icons/mountain-phase-7-02.png",
        "icons/mountain-phase-8-02.png",
    ];

    export let doc;
    export let disabled = false;

    let deletionTime = doc.deleteAfter;
    let phase =
        Math.floor((deletionTime - Date.now()) / (2548800000000 / 9)) % 9;

    function getClick(doc) {
        console.log('clicked');
        dispatch('click', doc);
    }
</script>

{#if disabled}
    <div>
        <img src={images[phase]} alt="document icon" style="filter: blur(1px);" />
    </div>
{:else}
    <div 
    on:click={getClick}
    on:keypress={getClick}
    >
        <img src={images[phase]} alt="document icon, phase #{phase}" />
    </div>
{/if}

<style>
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }
    img {
        max-width: 100px;
        max-height: 100px;
    }
</style>