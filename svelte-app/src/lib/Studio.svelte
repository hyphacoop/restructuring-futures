<script>
    import * as Earthstar from 'earthstar';
    import { onMount } from "svelte";

    import replica from "../store/replica";
    import cache from "../store/cache";
    import SingleDoc from "./SingleDoc.svelte";

    let documents = [];

    // fetch documents from the cache
    const fetchDocs = (async () => {
        documents = $cache.cache.queryDocs({
            filter: {
                pathStartsWith: "/studio",
            }
        
        });
        documents = documents.filter(doc => doc.path.split('/').length <= 4);
        console.log('Docs', documents);

     
    });

    $cache.cache.onCacheUpdated(() => {
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

    $: documents = documents;

</script>

<div>
    <h2>Studio</h2>
    
    <div class='flex'>
        {#if documents.length === 0}
            <p>No files yet</p>
        {:else}
            {#await documents}
                <p>Loading...</p>
            {:then documents}

                 {#each documents as doc (doc.textHash)}
                
                    <div id={doc.textHash}>

                        <SingleDoc {doc} on:update={updateUI} studio={true}/>

                    </div>
                {/each} 

           {/await}
        {/if} 
                </div>
</div>

<style>
    .flex {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }
    .flex div {
        margin:2rem;
    }
</style>