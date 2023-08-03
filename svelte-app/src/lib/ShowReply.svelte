<script>

    import cacheDetails from "../store/cache";
    import { onMount } from "svelte";

    import SingleReply from "./Components/SingleReply.svelte";

    export let doc;

    let replies = [];
    let showReplies = true;
    let showWarning = false;

    const getReplies = (async () => {
        let newPath = doc.path.split('!');
        replies = await $cacheDetails.queryDocs({
            filter: {
                pathStartsWith: newPath[0],
            }
        });
        replies = replies.filter(doc => doc.path.split('/').length > 6);
        showReplies = true;
    });




    $cacheDetails.onCacheUpdated(() => {
            getReplies();
            replies = replies;
    });

    $: replies = replies;

    $: if (replies.length >= 1) {
        showReplies = true;
        showWarning = false;
    } else {
        showWarning = true;
    }

    function updateUI() {
        setTimeout(() => {
            getReplies();
        }, 1000);
    }

    onMount(() => {
        getReplies();
    });

</script>
<div>
    

        {#if replies === undefined}
            {getReplies()}
        {:else if showReplies}
        <ul>
            {#each replies as doc (doc.signature)}

            <li id={doc.textHash}>

                {#if doc.text.includes('replied with voice')}
                <SingleReply isReply={true} title={doc.text} {doc} attachment={true} on:click={updateUI} on:update={updateUI} />
                {:else}
                <SingleReply isReply={true} title={doc.text} {doc} attachment={false} on:click={updateUI} on:update={updateUI} />
                {/if}
            </li>
            {/each} 
        </ul>
        {/if} 

</div>
<div>
    {#if showWarning}
    <p>There are no replies yet.</p>
{:else}

<!--Button to show replies-->
    <!--<button on:click={() => getReplies()}>See Replies</button>-->
    {/if}
</div>
<style>
    ul {
        list-style: none;
        padding: 0;
        text-align: left;
    }
    li {
        text-align: center;
        color:#222222;
        padding: 0.25rem;
        border-radius: 0;
        margin:0.5rem;
        height:auto;
}
</style>
