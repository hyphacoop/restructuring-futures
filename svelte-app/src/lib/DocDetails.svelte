<script>
  import { DocDriverIndexedDB } from "earthstar/browser";


  export let doc;
  export let attachment = true;
  export let isReply = false;
  let showDetails = false;
  let title = undefined;
  let content;
  let extended = false;

  $: if (doc.text !== undefined && doc.text.includes("<br>")) {
    content = doc.text.split("<br>");
    title = content.shift();
    title = title;
    extended = true;
  }
</script>

<button on:click={() => (showDetails = !showDetails)}> 📄Details </button>
{#if showDetails}
  <h2>Details</h2>
  <div>
    {#if attachment}
      <table>
        <tr>
          <td> Attachment type:</td>
          <td> 
            <strong>
                {doc.path.split(".")[doc.path.split(".").length - 1]}
            </strong> 
        </td>
        </tr><tr
          ><td> Attachment size:</td> <td>{doc.attachmentSize / 1000}</td> kb
        </tr>
      </table>
      {/if}
      {#if title !== undefined}
        <h3>
          {@html title}
        </h3>
        {#if extended}
          <ul>
            {#each content as item}
              <li>
                {@html item}
              </li>
            {/each}
          </ul>
        {/if}
      {:else}
        <h4>{@html doc.text}</h4>
      {/if}
    {#if isReply || !attachment}
    <div>
      <ul>
        <li><b>path:</b> {doc.path}</li>
        <li><b>author:</b> {doc.author}</li>
        <li><b>share:</b> {doc.share}</li>
        <li><b>timestamp:</b> {doc.timestamp / 1000}</li>
      </ul>
    </div>
    {/if}
  </div>
{/if}

<style>
  li {
    text-align: left;
    font-size: 0.86rem;
    list-style: none;
  }
  table {
    width: 100%;
  }
  div ul {
    padding:0.25rem;
    word-break: break-all;
    width: max-content;
    }
</style>
