<script>
    import ShowReply from "./ShowReply.svelte";
    import SendReply from "./SendReply.svelte";

    export let doc;

    let showDetails = true;


</script>


    
    
        <!--<button class="phase1" on:click={handleClick}>
            ↩️Replies
        </button>
        -->
        
{#if showDetails}
<div>
    <div class='replies mb-2'>
            <ShowReply {doc} on:success />
    </div>
        <SendReply {doc} on:success />       
</div> 
{/if}     



<style>
 .replies {
    overflow-y: scroll;
    height: auto;
    max-height:40vh;
 }
</style>