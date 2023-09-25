<script>
  import Router from 'svelte-spa-router';
  import Home from './lib/Home.svelte';

  import { showUserSettingsStore } from './store/showUserSettings'

  const routes = {
      '/': Home,
      '/redeem': () => {
          console.log("Redeem route triggered");
          showUserSettingsStore.set(true);
          console.log('App showUserSettingsStore', $showUserSettingsStore);
          return Home; // Redirects back to the Home component, but with the store value changed
      },
  };

</script>

<Router {routes} />
