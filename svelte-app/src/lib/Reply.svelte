<script>
    import ShowReply from "./ShowReply.svelte";
    import SendReply from "./SendReply.svelte";

    export let doc;

    let showDetails = false;

    function handleClick() {
        showDetails = !showDetails;

    }



</script>


    
    <div>
        <button on:click={handleClick}>
            ↩️
        </button>
        
{#if showDetails}
        <ShowReply {doc} on:success/>
        <SendReply {doc} on:success />        
{/if}     
    </div>


<style>

</style>