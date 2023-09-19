<script>
  import Router from 'svelte-spa-router';
  import Home from './lib/Home.svelte';
  import UserSettings from './lib/UserSettings.svelte';

  const routes = {
      '/': Home,
      '/redeem/*': UserSettings,
  };

</script>

<Router {routes} />
