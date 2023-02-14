<script>
    import * as Earthstar from "../assets/scripts/earthstar";
    import { onMount } from "svelte";


    import replica from "../store/replica";

    import Ephemerality from "./Ephemerality.svelte";
    import GetAttachment from "./GetAttachment.svelte";

    let documents = [];

    // @ts-ignore
    const cache = new Earthstar.ReplicaCache($replica.replica);

    // fetch documents from the cache
    const fetchDocs = (async () => {
        documents = cache.queryDocs({
            filter: {
                pathStartsWith: "/documents",
            }
        });
        console.log('Docs', documents);
    });

    cache.onCacheUpdated(() => {
	    fetchDocs();
    });
    
    onMount(() => {
        fetchDocs();
    });

    function updateUI() {

        setTimeout(() => {
            fetchDocs();
        }, 1000);
        
        console.log('UI updated');
    }

    $: documents = documents

</script>

<div>
    <h2>Files</h2>
    <ul>
        {#if documents.length === 0}
            <li>No files yet</li>
        {:else}
            {#await documents}
                <li>Loading...</li>
            {:then documents}
                {#each documents as doc, i}
                
                    <li>
                       {doc.text} 
                       
                        <GetAttachment {doc} />
                        
                        <Ephemerality {doc} on:update={updateUI} />

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