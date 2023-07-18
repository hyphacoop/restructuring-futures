import * as Earthstar from 'earthstar';
import { writable } from 'svelte/store';

// Create a new instance of the SharedSettings class.
const settings = new Earthstar.SharedSettings();
export default settings;

// Create a Svelte store that holds the shares
export const shares = writable(settings.shares);

settings.onSharesChanged(newShares => {
    shares.set(newShares);
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

export function updateShares(newShares) {
    shares.set(newShares);
}