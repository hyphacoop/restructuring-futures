<script>
   import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

export let xy = undefined;

function selectUploadType() {
  dispatch("selected", {
    type: "file",
    location: xy,
  });
}
</script>
<div>
  <div>
      <button
        class="phase1"
        on:click={selectUploadType}
        on:keypress={selectUploadType}
      >
        file upload
      </button>
</div>
</div>

<style>
      div {
        margin:0.5rem;
    }
</style>
