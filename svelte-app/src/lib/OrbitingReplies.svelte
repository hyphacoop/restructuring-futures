<script>
  import { onMount } from "svelte";
  import OrbitingIcon from "./Replies/OrbitingIcons.svelte";
  import cacheDetails from "../store/cache";
  export let doc = null;
  export let disabled = false;

  // The default diameter of the largest orbiting circles
  const orbitDiameter = 160;

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
  };

  onMount(fetchReplies);

  $: {
    doc && fetchReplies();
  }
</script>

<div
  id="circle-orbit-container"
  class:disabled
  style="
    height: {orbitDiameter}px;
    width: {orbitDiameter}px;
  "
>
{#each replies as reply, index (reply.textHash + reply.timestamp)}
  <OrbitingIcon {doc} {index} {orbitDiameter} {disabled}/>
{/each}
</div>

<style>
  /* ---------- Container for the orbiting circles animation ---------- */
  #circle-orbit-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  #circle-orbit-container.disabled {
    filter: blur(5px);
  }

  /* ---------- Inner orbit - This is the circles closest to the central point ---------- */
  .inner-orbit {
    position: absolute;
    border: 1px #597cb834 dashed;
    border-radius: 100%;
    animation: spin-right linear infinite;
  }

  /* ---------- Repeating styles for the inner orbiting circles ---------- */
  .inner-orbit-circles {
    top: 0; 
    left: 50%; 
    transform: translate(-50%, -50%);
    position: absolute;
    height: 10px;
    width: 10px;
    border-radius: 100%;
    background-color: #597cb8;
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
