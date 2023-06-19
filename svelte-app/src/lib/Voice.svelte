<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let xy = undefined;

  function selectUploadType() {
    dispatch("selected", {
      type: "audio",
      location: xy,
    });
  }
</script>
<div>
<button class="phase1" on:click={selectUploadType}> record audio </button>
</div>
<style>
  div {
    margin:0.5rem;
  }
</style>
