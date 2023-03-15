<script>

    import replica from "../store/replica";
    import authorKeypair from "../store/identity";
	import { elapsed } from '../store/time';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();




    let time = Date.now();
    let ephemeral = false;
    let timestamp = 0;


    export let doc;
    let deletionTime = doc.deleteAfter;

    async function add() {
        deletionTime += 3600000000;
        let alias = $authorKeypair.address.slice(1, 5);
        let removeChar = doc.path.split('!');
        let studioPath = removeChar[0].replace('/documents', '/studio') + removeChar[1];
        const result = await $replica.replica.set($authorKeypair, {
                text: doc.text + "<br> lifespan extended by " + alias + " on " + new Date().toLocaleString(),
                path: doc.path,
                deleteAfter: deletionTime
            });
        const studio = await $replica.replica.set($authorKeypair, {
            text: doc.text + "<br> lifespan extended by " + alias + " on " + new Date().toLocaleString(),
            path: studioPath,
        });
        console.log('studioPath', studioPath);
        console.log('doc.path', doc.path);
        console.log("result c", result);
        console.log("result s", studio);

    }

    async function remove() {
        let alias = $authorKeypair.address.slice(1, 5);
        let removeChar = doc.path.split('!');
        let studioPath = removeChar[0].replace('/documents', '/studio') + removeChar[1];
        console.log('studioPath', studioPath)
        deletionTime -= 3600000000;
        const result = await $replica.replica.set($authorKeypair, {
                text: doc.text + "<br> lifespan shortened by " + alias + " on " + new Date().toLocaleString(),
                path: doc.path,
                deleteAfter: deletionTime
            });
        const studio = await $replica.replica.set($authorKeypair, {
            text: doc.text + "<br> lifespan shortened by " + alias + " on " + new Date().toLocaleString(),
            path: studioPath,
        });
            console.log("result c", result);
            console.log("result s", studio);
    }

    async function deleteDoc() {
        dispatch('update');
        let alias = $authorKeypair.address.slice(1, 5);
        let removeChar = doc.path.split('!');
        let studioPath = removeChar[0].replace('/documents', '/studio') + removeChar[1];
        const result = await $replica.replica.set($authorKeypair, {
            path: doc.path,
            deleteAfter: (Date.now() + 1000) * 1000
        });
        const studio = await $replica.replica.set($authorKeypair, {
            text: doc.text + "<br> deleted by " + alias + " on " + new Date().toLocaleString(),
            path: studioPath,
        });
        console.log("studio 'delete'", studio);
        console.log("result delete", result);
    }

    $: timestamp = (($elapsed) + (time /1000) - (doc.timestamp / 1000000)) / 60;

</script>
<button on:click={() => ephemeral = !ephemeral}>
    {ephemeral ? '⌛Ephemeral' : '⏳Ephemeral'}
 </button>
 
 {#if ephemeral}

    <div id="flexcontainer">
        <button on:click={add}>
            ➕Extend
        </button>
        
        <button on:click={remove}>
            ➖Shorten 
        </button>
        
        <p>
            last interaction was {Math.trunc(timestamp)} {timestamp<=1?"minute":"minutes"} ago
        </p>
        
        <p>
            {Math.trunc(((deletionTime / 1000) - ($elapsed * 1000 + (time))) / 60000)} minutes left until deletion
        </p>
        
        <button on:click={() => deleteDoc()}>
            🗑️Delete
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
    width: max-content;
}

button {
    padding:0.5rem 1rem;
}

</style>