<script>
    import ShowReply from "./ShowReply.svelte";
    import SendReply from "./SendReply.svelte";

    export let doc;
    export let inStudio;

    let showDetails = false;


    function handleClick() {
        showDetails = !showDetails;

    }



</script>


    
    <div>
        <button on:click={handleClick}>
            ↩️Reply
        </button>
        
{#if showDetails}
        <ShowReply {doc} on:success {inStudio} />
        <SendReply {doc} on:success {inStudio} />        
{/if}     
    </div>


<style>

</style>