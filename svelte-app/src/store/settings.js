import * as Earthstar from 'earthstar';
import { writable, derived } from 'svelte/store';

// Create a new instance of the SharedSettings class.
const settings = new Earthstar.SharedSettings();
export default settings;

// Create a Svelte store that holds the shares
export const shares = writable(settings.shares);

settings.onSharesChanged(newShares => {
    shares.set(newShares);
});

// Create a Svelte store that holds the servers
export const servers = writable(settings.servers);

settings.onServersChanged(newServers => {
    servers.set(newServers);
});

export function removeShare(shareAddressToRemove) {
    // Remove share from SharedSettings
    const updatedShares = settings.removeShare(shareAddressToRemove);

    if (Array.isArray(updatedShares)) {
        // Update the shares from SharedSettings
        shares.set(updatedShares);
    } else {
        // handle ValidationError here
        console.error(updatedShares);
    }
}

export function removeSecret(shareAddress) {	
  // Remove share from SharedSettings
  const updatedShares = settings.removeSecret(shareAddress);
  console.log('updatedShares', updatedShares);
  if (Array.isArray(updatedShares)) {
      // Update the shares from SharedSettings
      shares.set(updatedShares);
  } else {
      // handle ValidationError here
      console.error(updatedShares);
  }
}

export function updateShares(newShares) {
    shares.set(newShares);
}

// Create a derived store that filters shares to only include "studio" shares
export const studioShares = derived(shares, $shares => $shares.filter(share => !share.includes('commons')));