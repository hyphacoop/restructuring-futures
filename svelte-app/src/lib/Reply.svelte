<script>
    import ShowReply from "./ShowReply.svelte";
    import SendReply from "./SendReply.svelte";

    export let doc;

    let showDetails = true;


</script>


    
    <div>
        <!--<button class="phase1" on:click={handleClick}>
            ↩️Replies
        </button>
        -->
        
{#if showDetails}
        <ShowReply {doc} on:success />
        <SendReply {doc} on:success />        
{/if}     
    </div>


<style>

</style>