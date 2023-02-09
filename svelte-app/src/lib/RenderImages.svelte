<script>
    import * as Earthstar from "../assets/scripts/earthstar";
    import { onMount } from "svelte";

    import authorKeypair from "../store/identity";
    import shareKeypair from "../store/share";
    import replica from "../store/replica";

    import Ephemerality from "./Ephemerality.svelte";

    let shareDetails;
    let authorDetails;
    let replicaDetails;
    let images = [];

    shareKeypair.subscribe((r) => {
        shareDetails = r;
    });

    authorKeypair.subscribe((r) => {
        authorDetails = r;
    });

    replica.subscribe((r) => {
        replicaDetails = r;
    });

    // @ts-ignore
    const cache = new Earthstar.ReplicaCache(replicaDetails.replica);

    // fetch images from the cache
    const fetchImages = (async () => {
        images = cache.queryDocs({
            filter: {
                pathStartsWith: "/images",
            }
        });
        console.log('imageDocs', images);
    });

    cache.onCacheUpdated(() => {
	    fetchImages();
    });
    
    onMount(() => {
        fetchImages();
    });

    $: images = images

</script>

<div>
    <h2>Images</h2>
    <ul>
        {#if images.length === 0}
            <li>No images yet</li>
        {:else}
            {#await images}
                <li>Loading...</li>
            {:then images}
                {#each images as image}
                    <li>
                       {image.text} 
                       <Ephemerality {image} />
                       {image.deleteAfter}
                    </li>
                {/each}
            {/await}
        {/if}
    </ul>
</div>

<style>
    ul {
        list-style: none;
        padding: 0;
        text-align: left;
    }
</style>