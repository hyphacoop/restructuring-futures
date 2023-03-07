<script>

    import cache from "../store/cache";
    import { onMount } from "svelte";

    import SingleDoc from "./SingleDoc.svelte";

    export let doc;
    export let inStudio;

    let replies = [];
    let showReplies = true;
    let showWarning = false;

    const getReplies = (async () => {
        let newPath = doc.path.split('!');
        replies = await $cache.cache.queryDocs({
            filter: {
                pathStartsWith: newPath[0],
            }
        });
        replies = replies.filter(doc => doc.path.split('/').length > 6);
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
                <SingleDoc isReply={true} title={doc.text} {doc} attachment={true} on:click={updateUI} {inStudio} on:update={updateUI} reply={false}  />
                {:else}
                <SingleDoc isReply={true} title={doc.text} {doc} attachment={false} on:click={updateUI} {inStudio} on:update={updateUI} reply={false} />
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
        background-color:#ffffff;
        color:#222222;
        padding: 1em;
        border-radius: 15px;
        border: 1px solid #888888;
        margin:1rem;
        width: fit-content;
}
p.max-content {
    width:max-content;
}
</style>
