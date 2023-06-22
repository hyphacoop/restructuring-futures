<script>
    
    import replica from "../store/replica";
    import authorKeypair from "../store/identity";
    import cache from "../store/cache";
    
    let documents = [];
    let paths = [];

    const fetchDocs = async () => {
        documents = $cache.cache.queryDocs({
            filter: {
                pathStartsWith: "/documents",
            }
        });

        // Extract paths from documents and store in paths array
        paths = documents.map(doc => doc.path);
    }

     async function deleteTool(deletePath) {

        const result = await $replica.replica.set($authorKeypair, {
            path: deletePath,
            deleteAfter: (Date.now() + 1000) * 1000
        });
        console.log("result delete", result);
    }
    const cleanup = async () => {
        await fetchDocs();
        for(let path of paths) {
            await deleteTool(path);
        }
    }

    let deletePath = "";
</script>


<button on:click={cleanup}>Clean up DB</button>
        <textarea bind:value={deletePath}></textarea>
        <button on:click={() => deleteTool(deletePath)}>
            Delete tool
        </button>
