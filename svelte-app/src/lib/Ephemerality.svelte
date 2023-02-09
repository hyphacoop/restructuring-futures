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

    export let image;
    let deletionTime = image.deleteAfter;

    async function add() {
        deletionTime += 1000000;
        const result = await replicaDetails.replica.set(authorDetails, {
                path: image.path,
                deleteAfter: deletionTime
            });
            console.log("result ", result);
    }

    async function remove() {
        deletionTime -= 1000000;
        const result = await replicaDetails.replica.set(authorDetails, {
                path: image.path,
                deleteAfter: deletionTime
            });
            console.log("result ", result);
    }
    
</script>

<div>
    <button on:click={add}>
        +
    </button>
    <button on:click={remove}>
        -
    </button>
</div>