<script>
    import { fade } from "svelte/transition";
    import Ephemerality from "./Ephemerality.svelte";
    import GetAttachment from "./GetAttachment.svelte";
    import DocDetails from "./DocDetails.svelte";
    import Reply from "./Reply.svelte";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let images = [
  'icons/mountain-phase-0-02.png',
  'icons/mountain-phase-1-02.png',
  'icons/mountain-phase-2-02.png',
  'icons/mountain-phase-3-02.png',
  'icons/mountain-phase-4-02.png',
  'icons/mountain-phase-5-02.png',
  'icons/mountain-phase-6-02.png',
  'icons/mountain-phase-7-02.png',
  'icons/mountain-phase-8-02.png',
];

    let showDetails = false;
    

    export let doc;
    export let studio = false;
    export let attachment = true;
    export let reply = true;
    export let title = undefined;
    export let isReply = false;
    export let disabled = false;

    let deletionTime = doc.deleteAfter;

    let extended = false;
    let content = undefined;
    let reaction = 24;
    let phase = undefined;
    
    $: console.log('deletionTime' + deletionTime);
    $: phase = Math.floor((deletionTime - Date.now()) / (2548800000000 / 9)) % 9;
    $: console.log(doc.path + 'phase ' + phase);


    $: if (title !== undefined && title.includes("<br>")) {
        content = title.split("<br>");
        title = content.shift();
        title = title;
        extended = true;
        console.log("content", content)
        reaction = content.length * 2 + 12;
    } else if (doc.text.includes("<br>")) {
        content = doc.text.split("<br>");
        reaction = content.length * 3 + 8;
    } else if (isReply) {
        reaction = 10;
    }

    $: console.log("reaction", reaction);

</script>
{#if disabled}
    <div class='main disabled' 
        class:replies="{isReply === true}">
        <img 
        style="margin-bottom:-3px;"
        src={images[phase]}
        alt="document icon"
        width={reaction}
        height={reaction}
    />
    </div>
{:else}
    <div class='main' 
        class:replies="{isReply === true}"
        on:click|self={() =>  {
            showDetails = !showDetails;
            dispatch('click', doc);
        }}
        on:keypress|self={() => (showDetails = !showDetails)}>
        {#if !showDetails}
            <div class="flex row">
                <p on:click={() => {
                    showDetails = !showDetails;
                    dispatch('click', doc);
                }}
                    on:keypress={() => (showDetails = !showDetails)} >
              
                    <img 
                    style="margin-bottom:-3px;"
                    src={images[phase]}
                    alt="document icon"
                    width={reaction}
                    height={reaction}
                /></p>
            
                {#if title !== undefined}
                <div>{@html title}</div>

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
            <img 
            style="margin-bottom:-3px;"
            src={images[phase]}
            alt="document icon"
            width={reaction}
            height={reaction}
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
        margin:2rem;
        padding:1rem;
        border: 1px solid transparent;
        border-radius: 0rem;
        width:fit-content;
        height: fit-content;
        max-height:15vh;
    }
    .main:hover {
        border:1px dotted #111111;
    }
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
        margin:0.1rem;
        padding:0.1rem;
        max-width: 150px;
        width: max-content;
    }
    .replies:hover {
        background-color:transparent;
        border:1px solid transparent;
    }
    .replies p {
        margin:0.1rem;
    }

    .row {
        flex-direction: row;
    }
    .disabled {
        opacity: 0.95;
        filter: blur(1px);
    }
</style>
