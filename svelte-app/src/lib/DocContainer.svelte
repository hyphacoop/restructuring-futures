<script>
    import * as Earthstar from "../assets/scripts/earthstar";
    import { onMount } from "svelte";

    import authorKeypair from "../store/identity";
    import shareKeypair from "../store/share";
    import replica from "../store/replica";

    import Ephemerality from "./Ephemerality.svelte";
    import GetAttachment from "./GetAttachment.svelte";

    let shareDetails;
    let authorDetails;
    let replicaDetails;
    let images = [];
    let doc = {};

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
    <h2>Files</h2>
    <ul>
        {#if images.length === 0}
            <li>No files yet</li>
        {:else}
            {#await images}
                <li>Loading...</li>
            {:then images}
                {#each images as doc}
                    <li>
                       {doc.text} 
                       
                       <GetAttachment {doc} />

                       <Ephemerality {doc} />
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
    li {
        text-align: center;
        border: 2px dotted #999;
        padding: 1em;
        border-radius: 15px;
        margin:1rem;
    }
</style>