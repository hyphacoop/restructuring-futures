<script>

    import replica from "../store/replica";
    import authorKeypair from "../store/identity";




    let authorDetails;
    let replicaDetails;

    
    authorKeypair.subscribe((r) => {
        authorDetails = r;
    });

    replica.subscribe((r) => {
        replicaDetails = r;
    });

    export let doc;
    let deletionTime = doc.deleteAfter;

    async function add() {
        deletionTime += 60000000;
        const result = await replicaDetails.replica.set(authorDetails, {
                path: doc.path,
                deleteAfter: deletionTime
            });
            console.log("result ", result);
    }

    async function remove() {
        deletionTime -= 60000000;
        const result = await replicaDetails.replica.set(authorDetails, {
                path: doc.path,
                deleteAfter: deletionTime
            });
            console.log("result ", result);
    }
    $: currentTime = Date.now();
    $: timeInMinutes = Math.trunc(((deletionTime / 1000) - currentTime) / 60000);

</script>

<div id="flexcontainer">
    <button on:click={add}>
        +
    </button>
    <button on:click={remove}>
        -
    </button>
    <p>{timeInMinutes} minutes left until deletion</p>
</div>

<style>
#flexcontainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
}
#flexcontainer > * {
    margin:0.25rem;
}

button {
    padding:0.5rem 1rem;
}

</style>