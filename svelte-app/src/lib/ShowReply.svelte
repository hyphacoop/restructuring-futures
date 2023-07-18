<script>

    import cacheDetails from "../store/cache";
    import { onMount } from "svelte";

    import SingleDoc from "./SingleDoc.svelte";

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
                <SingleDoc isReply={true} title={doc.text} {doc} attachment={true} on:click={updateUI} on:update={updateUI} reply={false}  />
                {:else}
                <SingleDoc isReply={true} title={doc.text} {doc} attachment={false} on:click={updateUI} on:update={updateUI} reply={false} />
                {/if}
            </li>
            {/each} 
        </ul>
        {/if} 

</div>
<div>
    {#if showWarning}
    <p class="max-content">There are no replies yet.</p>
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
        background-color:#D9D9D9;
        color:#222222;
        padding: 1em;
        border-radius: 0;
        margin:1rem;
        width: fit-content;
        height:auto;
}
p.max-content {
    width:max-content;
}
</style>
