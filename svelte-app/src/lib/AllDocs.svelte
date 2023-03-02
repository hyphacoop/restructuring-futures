<script>
    import { onMount } from "svelte";

    import cache from "../store/cache";
    import SingleDoc from "./SingleDoc.svelte";

    let documents = [];

    // fetch documents from the cache
    const fetchDocs = (async () => {
        documents = $cache.cache.queryDocs({
            filter: {
                pathStartsWith: "/documents",
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
    }

    $: documents = documents;

</script>

<div>
    <h2>Commons</h2>
    
    <div class='flex'>
        {#if documents.length === 0}
            <p>No files yet</p>
        {:else}
            {#await documents}
                <p>Loading...</p>
            {:then documents}

                 {#each documents as doc (doc.textHash)}
                
                    <div id={doc.textHash}>

                        <SingleDoc {doc} on:update={updateUI} />

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
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0;
    max-width: 600px;
    margin: 0;
}
.flex div {
    background-color: transparent;
    padding:0;
    margin: 0;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

}
</style>