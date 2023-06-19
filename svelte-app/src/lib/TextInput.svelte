<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let xy = [0, 0];

  function selectUploadType() {
    dispatch("selected", {
      type: "text",
      location: xy,
    });
  }
</script>

<div>
  <div>
    <button class="phase1" on:click={selectUploadType}> written text </button>
  </div>
</div>

<style>
  div {
    margin: 0.5rem;
  }
</style>
