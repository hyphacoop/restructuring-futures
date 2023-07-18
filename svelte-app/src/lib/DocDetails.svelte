<script>
  import { DocDriverIndexedDB } from "earthstar/browser";

  import { onMount } from "svelte";

  export let doc;
  export let attachment = true;
  export let isReply = false;
  let showDetails = false;
  let title = undefined;
  let content;
  let extended = false;

  onMount(() => {
    showDetails = true;
  });

  $: if (doc.text !== undefined && doc.text.includes("<br>")) {
    content = doc.text.split("<br>");
    title = content.shift();
    title = title;
    extended = true;
  }

  function removeTitleContent(text) {
    // Find the indices of '#Title:' and '#Notes:'
    var titleIndex = text.indexOf("#Title:");
    var notesIndex = text.indexOf("#Notes:");

    // If both '#Title:' and '#Notes:' were found and '#Title:' comes before '#Notes:'
    if (titleIndex !== -1 && notesIndex !== -1 && titleIndex < notesIndex) {
      // Get the substring from start till '#Title:' (exclusive)
      var start = text.substring(0, titleIndex);
      // Get the substring from '#Notes:' (inclusive) till end
      var end = text.substring(notesIndex);
      // Combine the two parts and return
      return start + ' ' + end;
    }

    // If '#Title:' or '#Notes:' was not found or '#Title:' does not come before '#Notes:', return the original text
    return text;
  }
</script>

<div class="my-4 text-left">
  <button on:click={() => (showDetails = !showDetails)}>
    {#if showDetails}
      📄Hide details
    {:else}
      📄Show details
    {/if}
  </button>
  {#if showDetails}
    <div>
      {#if attachment}
        <table class="my-4">
          <tr>
            <td> Attachment type: </td>
            <td>
              <strong>
                {doc.path.split(".")[doc.path.split(".").length - 1]}
              </strong>
            </td>
          </tr>
          <tr
            ><td> Attachment size:</td> <td>{doc.attachmentSize / 1000}</td> kb
          </tr>
        </table>
      {/if}
      {#if title !== undefined}
        <div>
          {@html title}
        </div>
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
        <div class="my-4 break-words">{@html removeTitleContent(doc.text)}</div>
      {/if}
        <div class="my-4 break-all">
          <ul>
            <li><b>path:</b> {doc.path}</li>
            <li><b>author:</b> {doc.author}</li>
            <li><b>share:</b> {doc.share}</li>
            <li><b>timestamp:</b> {doc.timestamp / 1000}</li>
          </ul>
        </div>
    </div>
  {/if}
</div>

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
    padding: 0.25rem;
    word-break: break-all;
    width: auto;
  }
</style>
