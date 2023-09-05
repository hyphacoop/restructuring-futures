<script>
  import ServerList from "../Components/ServerList.svelte";
  import AddServer from "../Server/AddServer.svelte";
  import RemoveServer from "../Server/RemoveServer.svelte";

  import { servers } from "../../store/settings";

$: console.log('settings.servers', $servers);
</script>
<div class='flex flex-col items-start pb-24'>
  <h3>
      Server settings
  </h3>
  <h4>
    Current {$servers.length <= 2
      ? "Server:"
      : `${$servers.length} Servers:`}
  </h4>
  <div class='my-4'>
    
    <ServerList />

  </div>

  <AddServer />
  <RemoveServer />

</div>
