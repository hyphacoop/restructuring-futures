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
    
    <ul>
        {#if documents.length === 0}
            <li>No files yet</li>
        {:else}
            {#await documents}
                <li>Loading...</li>
            {:then documents}

                 {#each documents as doc (doc.textHash)}
                
                    <li id={doc.textHash}>

                        <SingleDoc {doc} on:update={updateUI} studio={true}/>

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
        background-color:#f9f9f9;
        padding: 1em;
        border-radius: 15px;
        margin:1rem;
    }
</style>