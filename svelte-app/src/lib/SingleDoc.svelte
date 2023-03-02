<script>
    import Gravatar from "svelte-gravatar";

    import Ephemerality from "./Ephemerality.svelte";
    import GetAttachment from "./GetAttachment.svelte";
    import DocDetails from "./DocDetails.svelte";
    import Reply from "./Reply.svelte";

    let showDetails = false;

    export let doc;
    export let studio = false;
    export let attachment = true;
    export let title = undefined;

    let extended = false;
    let timespan = undefined;

    $: console.log("studio", studio);

    $: if (title !== undefined && title.includes("<br>")) {
        timespan = title.split("<br>").pop();
        title = title;
        extended = true;
    }
</script>
<main 
    on:click|self={() => (showDetails = !showDetails)}
    on:keypress|self={() => (showDetails = !showDetails)}>
{#if showDetails}
<button
    on:click={() => (showDetails = !showDetails)}
    on:keypress|self={() => (showDetails = !showDetails)} >

    <Gravatar
        style="margin-bottom:-3px;"
        email={doc.text}
        size="18"
        default="retro"
    />

        </button>

        {:else}
        <p on:click={() => (showDetails = !showDetails)}
            on:keypress={() => (showDetails = !showDetails)} >
        <Gravatar
        style="margin-bottom:-3px;"
        email={doc.text}
        size="18"
        default="retro"
    /></p>
    {/if}
{#if title}
    <h3>{@html title}</h3>
{:else if extended}
    <h3>{@html title}</h3>
    <h4>{@html timespan}</h4>
{/if}
{#if showDetails}
    <div class="flex">
        {#if attachment}
            <div>
                <GetAttachment {doc} />
            </div>
        {/if}
        <div>
            <DocDetails {doc} {attachment} />
        </div>
        {#if attachment}
            <div>
                <Reply {doc} />
            </div>
        {/if}
        {#if !studio}
            <div>
                <Ephemerality {doc} on:update />
            </div>
        {/if}
    </div>
{/if}
</main>
<style>
    .flex {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        max-width: min-content;
        
    }
    main {
        color: #1a1a1a;
        background-color: #f9f9f9;
        margin:2rem;
        padding:1rem;
        border:2px solid transparent;
    }
    main:hover {
        border:2px solid #111111;
    }
</style>
