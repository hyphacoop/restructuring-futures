<script>

    import replica from "../store/replica";
    import authorKeypair from "../store/identity";
	import { elapsed } from '../store/time';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();




    let time = Date.now();
    let ephemeral = false;


    export let doc;
    let deletionTime = doc.deleteAfter;

    async function add() {
        deletionTime += 60000000;
        const result = await $replica.replica.set($authorKeypair, {
                path: doc.path,
                deleteAfter: deletionTime
            });
            console.log("result ", result);
    }

    async function remove() {
        deletionTime -= 60000000;
        const result = await $replica.replica.set($authorKeypair, {
                path: doc.path,
                deleteAfter: deletionTime
            });
            console.log("result ", result);
    }

    async function deleteDoc() {
        dispatch('update');

        const result = await $replica.replica.set($authorKeypair, {
            path: doc.path,
            deleteAfter: (Date.now() + 1000) * 1000
        });

        console.log("result ", result);
    }

</script>

<button on:click={() => ephemeral = !ephemeral}>
    {ephemeral ? '⌛' : '⏳'}
 </button>
 
 {#if ephemeral}

    <div id="flexcontainer">
        <button on:click={add}>
            ➕
        </button>
        <button on:click={remove}>
            ➖
        </button>
        <p>{Math.trunc(((deletionTime / 1000) - ($elapsed * 1000 + (time))) / 1000)} seconds left until deletion</p>
        <button on:click={() => deleteDoc()}>
            🗑️
        </button>
    </div>

{/if}
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