<script>
    import ShowReply from "./ShowReply.svelte";
    import SendReply from "./SendReply.svelte";

    export let doc;
    export let title;

    let showDetails = true;

</script>


    
    
        <!--<button class="phase1" on:click={handleClick}>
            ↩️Replies
        </button>
        -->
        
{#if showDetails}
<div class='w-auto'>
    <h5 class='mx-4 px-8 text-left'>Artefact: {title}</h5>
    <div class='replies mb-2'>
            <ShowReply {doc} on:success />
    </div>
        <SendReply {doc} on:success />       
</div> 
{/if}     



<style>

h5 {
    border: 1px solid #71302B;
background: #FFF5D9; 
padding:0.5rem;
}
 .replies {
    overflow-y: scroll;
    height: auto;
    max-height:40vh;
    
 }
</style>