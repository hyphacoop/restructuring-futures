<script>
    import Gravatar from 'svelte-gravatar';

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

    $: console.log('studio', studio);

    if (title !== undefined && title.includes('<br>')) {
            timespan = title.split('<br>').pop();
            title = title;
            extended = true;
    }
</script>

<button on:click={() => (showDetails = !showDetails)} on:keypress={() => (showDetails = !showDetails)}>
    <Gravatar style="margin-bottom:-3px;" email={doc.text} size="18" default="retro"/>
</button>
{#if title}
    <h3>{@html title}</h3>
{:else if extended}
    <h3>{@html title}</h3>
    <h4>{@html timespan}</h4>
{/if}
{#if showDetails}

    {#if attachment}
        <GetAttachment {doc} />
    {/if}

    <DocDetails {doc} {attachment} />

    <Reply {doc} />

    {#if !studio}
        <Ephemerality {doc} on:update />
    {/if}

{/if}