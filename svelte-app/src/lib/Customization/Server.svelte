<script>
  import ServerList from "../Components/ServerList.svelte";
  import AddServer from "../Server/AddServer.svelte";
  import RemoveServer from "../Server/RemoveServer.svelte";

  import settings from "../../store/settings";
</script>
<div class='flex flex-col items-start pb-24'>
  <h3>
      Server settings
  </h3>
  <h4>
    Currrent {settings.servers.length === 1
      ? "Server:"
      : `${settings.servers.length} Servers:`}
  </h4>
  <div class='my-4'>
    <ServerList />

  </div>
<AddServer />
<RemoveServer />

</div>
