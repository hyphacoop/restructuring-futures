<script>

    import cache from "../store/cache";
    import { onMount } from "svelte";

    import SingleDoc from "./SingleDoc.svelte";

    export let doc;

    let replies = [];
    let showReplies = true;

    const getReplies = (async () => {
        let newPath = doc.path.split('!');
        replies = await $cache.cache.queryDocs({
            filter: {
                pathStartsWith: newPath[0],
            }
        });
        replies = replies.filter(doc => doc.path.split('/').length > 4);
        showReplies = true;
    });




    $cache.cache.onCacheUpdated(() => {
        console.log('oncacheupdated');
        console.log('oncacheupdated replies', replies)
            getReplies();
            console.log('oncacheupdated after getreplies', replies)
            replies = replies;
    });

    $: replies = replies;

    $: if (replies.length >= 1) {
        showReplies = true;
    }

    function updateUI() {
        setTimeout(() => {
            getReplies();
        }, 1000);
    }

</script>

    <button on:click={() => getReplies()}>Replies</button>

        {#if replies === undefined}
            {getReplies()}
        {:else if showReplies}
        <ul>
            {#each replies as doc (doc.signature)}

            <li id={doc.textHash}>

                <SingleDoc title={doc.text} {doc} attachment={false} on:click={updateUI}/>

            </li>
            {/each} 
        </ul>
        {/if} 
<style>
    ul {
        list-style: none;
        padding: 0;
        text-align: left;
    }
    li {
        text-align: center;
        background-color:#ffffff;
        color:#222222;
        padding: 1em;
        border-radius: 15px;
        border: 1px solid #888888;
        margin:1rem;
        width: fit-content;
}
</style>
