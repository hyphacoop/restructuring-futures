<script>

    import cacheDetails from "../store/cache";
    import { onMount } from "svelte";

    import SingleReply from "./Components/SingleReply.svelte";

    export let doc;

    let replies = [];
    let unfilteredReplies = [];
    let showReplies = true;
    let showWarning = false;
    let expandedReply = null;

    function toggleExpand(hash) {
        if (expandedReply === hash) {
            expandedReply = null;
        } else {
            expandedReply = hash;
        }
    }

    const getReplies = (async () => {
        let newPath;
        if (doc.path.includes('!')) {
            newPath = doc.path.split('!')[0];
        } else {
            let match = doc.path.match(/(\/documents\/(page\d+\/)?\d+\/\d+\/\d+)/);
            if (match && match[1]) {
                newPath = match[1];
                console.log('newPath', newPath)
            } else {
                throw new Error("Invalid path format");
            }
        }
        unfilteredReplies = await $cacheDetails.queryDocs({
            filter: {
                pathStartsWith: newPath,
            }
        });
        if (newPath.includes('/page')) {
            replies = unfilteredReplies.filter(doc => doc.path.split('/').length > 7);
        } else {
            replies = unfilteredReplies.filter(doc => doc.path.split('/').length > 6);
        }
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

            <li id={doc.textHash} class={expandedReply === doc.textHash ? 'expanded' : ''}>
                <button class='w-full' on:click={() => toggleExpand(doc.textHash)} 
                        on:keydown={e => (e.key === 'Enter' || e.key === ' ') && toggleExpand(doc.textHash)}
                >
                {#if doc.text.includes('replied with voice')}
                <SingleReply isReply={true} title={doc.text} {doc} attachment={true} on:click={updateUI} on:update={updateUI} />
                {:else}
                <SingleReply isReply={true} title={doc.text} {doc} attachment={false} on:click={updateUI} on:update={updateUI} expanded={expandedReply === doc.textHash}/>
                {/if}
                </button>
            </li>
            {/each} 
        </ul>
        {/if} 

</div>

    {#if showWarning}
    <div class='flex flex-col items-start'>
    <div class='left-line'>There are no replies yet.</div>
</div>
    {/if}

<style>

    ul {
        list-style: none;
        padding: 0;
        text-align: left;
    }
    li, .left-line {
        text-align: center;
        color:#222222;
        padding: 0.25rem;
        border-radius: 0;
        margin:0rem;
        width:auto;
        height:auto;
        border-left: 1px solid #22222222;
        padding-left:1rem;
        padding-top: 0.5rem;   
        padding-bottom: 0.5rem;
        margin-left:1.5rem;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
    }

    li.expanded {
        white-space: normal;
        max-height: none; 
    }

li::before {
    content: "";
    position: absolute;
    top: 50%; /* Vertically center */
    left: 0rem; /* Start from left outside of the li */
    width: 1rem; /* Width of the line */
    height: 1px; /* Height of the line (change this if you want thicker line) */
    background-color: #22222222; /* Color of the line */
    transform: translateY(-50%); /* Ensure the line is centered */
}


li:last-child {
  padding-bottom: 1.5rem;
}

button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    -webkit-appearance: none; /* for older versions of Safari */
    -moz-appearance: none; /* for older versions of Firefox */
    appearance: none;
    }

    button:hover {
    background-color: none;  /* Sample gray background */
    color: #000;  /* Sample black text color */
    box-shadow: none;
    transform: none;
}
</style>
