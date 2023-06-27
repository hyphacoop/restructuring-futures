import * as Earthstar from 'earthstar';
import { writable } from 'svelte/store';
import replica from "./replica";

// Create a writable store for cache
const cacheDetails = writable(null);

// Subscribe to replica
replica.subscribe(replicaDetails => {
    if (!replicaDetails || !replicaDetails.replica) {
        console.error("Replica is undefined or does not contain a valid replica property");
        return;
    }
    // Create a new ReplicaCache every time the replica changes
    try {
        const newCache = new Earthstar.ReplicaCache(replicaDetails.replica);
        // Update the cacheDetails store
        cacheDetails.set(newCache);
    } catch (error) {
        console.error("Failed to create new cache:", error);
    }
});

export default cacheDetails;
