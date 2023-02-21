<script>
    import Gravatar from 'svelte-gravatar';

    import Ephemerality from "./Ephemerality.svelte";
    import GetAttachment from "./GetAttachment.svelte";
    import DocDetails from "./DocDetails.svelte";

    let showDetails = false;

    export let doc;
    
</script>

<button on:click={() => (showDetails = !showDetails)} on:keypress={() => (showDetails = !showDetails)}>
    <Gravatar style="margin-bottom:-3px;" email={doc.text} size="18" default="retro"/>
</button>
{#if showDetails}

    <GetAttachment {doc} />
    
    <Ephemerality {doc} on:update />

    <DocDetails {doc} />

{/if}