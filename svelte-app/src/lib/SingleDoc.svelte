<script>
    import Gravatar from "svelte-gravatar";
    import { fade } from "svelte/transition";
    import Ephemerality from "./Ephemerality.svelte";
    import GetAttachment from "./GetAttachment.svelte";
    import DocDetails from "./DocDetails.svelte";
    import Reply from "./Reply.svelte";

    let showDetails = false;

    export let doc;
    export let studio = false;
    export let attachment = true;
    export let reply = true;
    export let title = undefined;
    export let inStudio;
    export let isReply = false;
    export let disabled = false;

    let extended = false;
    let content = undefined;
    let reaction = 48;

    $: if (title !== undefined && title.includes("<br>")) {
        content = title.split("<br>");
        title = content.shift();
        title = title;
        extended = true;
        console.log("content", content)
        reaction = content.length * 2 + 48;
    } else if (doc.text.includes("<br>")) {
        content = doc.text.split("<br>");
        reaction = content.length * 3 + 32;
    } else if (isReply) {
        reaction = 18;
    }

    $: console.log("reaction", reaction)
</script>
{#if disabled}
    <div class='main disabled' 
        class:replies="{isReply === true}">
        <Gravatar
        style="margin-bottom:-3px;"
        email={doc.text}
        size={reaction}
        default="retro"
    />
    </div>
{:else}
    <div class='main' 
        class:replies="{isReply === true}"
        on:click|self={() => (showDetails = !showDetails)}
        on:keypress|self={() => (showDetails = !showDetails)}>
        {#if !showDetails}
            <div class="flex row">
                <p on:click={() => (showDetails = !showDetails)}
                    on:keypress={() => (showDetails = !showDetails)} >
                <Gravatar
                style="margin-bottom:-3px;"
                email={doc.text}
                size={reaction}
                default="retro"
            /></p>
            
                {#if title !== undefined}
                <h3>{@html title}</h3>

                <!-- Display ephemeral interaction log-->

                <!-- Currently hidden
                {#if extended}
                    <ul>
                        {#each content as item}
                        <li>
                            {@html item}
                        </li>
                        {/each}
                    </ul>
                    {/if}-->
                {/if}
                </div>
        {/if}
    {#if showDetails}
        <div class="flex">
            <button
            on:click={() => (showDetails = !showDetails)}
            on:keypress|self={() => (showDetails = !showDetails)} >

            <Gravatar
                style="margin-bottom:-3px;"
                email={doc.text}
                size="18"
                default="retro"
            />
            Artifact
                </button>
            {#if attachment}
                <div>
                    <GetAttachment {doc} />
                </div>
            {/if}
            <div>
                <DocDetails {doc} {attachment} {isReply} />
            </div>
            {#if reply}
                <div>
                    <Reply {doc} {inStudio}/>
                </div>
            {/if}
            {#if !studio}
                <div>
                    <Ephemerality {doc} on:update />
                </div>
            {/if}
        </div>
    {/if}
    </div>
{/if}   

<style>
    .flex {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
        max-width: max-content;
        
    }
    .main {
        color: #1a1a1a;
        background-color: #f9f9f9;
        margin:2rem;
        padding:1rem;
        border: 1px solid transparent;
        border-radius: 0.5rem;
        width:fit-content;
        height: fit-content;
    }
    .main:hover {
        border:1px dotted #111111;
    }
    /* li {
        list-style: none;
        font-size: 0.75rem;
    } */ 
    button {
        border-color:#111111;
        border-style: dashed;
    }
    button:hover {
        border-color:#111111;
        border-style: solid;
    }
    .replies {
        display: flex;
        background-color: white;
        margin:0.5rem;
        padding:0.5rem;
        max-width: 850px;
        width: max-content;
    }
    .replies:hover {
        background-color:transparent;
        border:1px solid transparent;
    }
    .replies p {
        margin:1rem;
    }
    .replies h3 {
        max-width: 100%;
    }
    .row {
        flex-direction: row;
    }
    .disabled {
        opacity: 0.5;
    }
</style>
