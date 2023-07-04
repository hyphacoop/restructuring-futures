<script>
  import { onMount } from "svelte";
  import cacheDetails from "../store/cache";
  export let doc = null;
  export let disabled = false;

  let replies = [];

  const fetchReplies = async () => {
    // split the path by "/"
    const pathParts = doc.path.split("/");
    // remove the last part (the filename)
    pathParts.pop();
    // rejoin the path
    const basePath = pathParts.join("/");

    // fetch the replies that start with the basePath
    let tempReplies = await $cacheDetails.queryDocs({
      filter: {
        pathStartsWith: basePath,
      },
    });
      // Exclude the first reply (the document itself)
    replies = tempReplies.slice(1);
    console.log("Replies", replies);
  };

  onMount(fetchReplies);
</script>

<div id="circle-orbit-container" class:disabled>
  {#each replies as reply, index (reply.textHash + reply.timestamp)}
  <div
  class="inner-orbit"
  style="
    top: {62.5 + index * 10}px;
    left: {62.5 + index * 10}px;
    width: {125 - index * 20}px;
    height: {125 - index * 20}px;
    animation-duration: {5 + index}s;
  "
>
      <div class="inner-orbit-circles" />
    </div>
  {/each}
</div>

<style>
  /* ---------- Container for the orbiting circles animation ---------- */
  #circle-orbit-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 250px;
    width: 250px;
    z-index: 1;
  }

  #circle-orbit-container.disabled {
    filter: blur(1px);
  }

  /* ---------- Inner orbit - This is the circles closest to the central point ---------- */
  .inner-orbit {
    position: absolute;
    border: 1px #4a437f dashed;
    border-radius: 100%;
    -webkit-animation: spin-right linear infinite;
    animation: spin-right linear infinite;
  }

  /* ---------- Repeating styles for the inner orbiting circles ---------- */
  .inner-orbit-circles {
    position: absolute;
    top: 62px;
    left: -6px;
    height: 10px;
    width: 10px;
    border-radius: 100%;
    background-color: #9f98e6;
  }

  /* ---------- Animation ---------- */
  @-webkit-keyframes spin-right {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes spin-right {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
