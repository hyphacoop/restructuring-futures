<script>
import AddShare from "./ShareSettings/AddShare.svelte";
import ShareSwitcher from "./ShareSettings/ShareSwitcher.svelte";
import RemoveShare from "./ShareSettings/RemoveShare.svelte";
import GenerateShare from "./ShareSettings/GenerateShare.svelte";
</script>

<div>
  <h4>Share Settings</h4>
  <ShareSwitcher />
  <GenerateShare />
  <AddShare />
  <RemoveShare />
</div>

<style>
  div {
    margin-bottom: 3rem;
    width: 100%;
  }
</style>