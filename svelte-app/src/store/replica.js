import * as Earthstar from 'earthstar';
import { ReplicaDriverWeb } from "earthstar/browser";
import { writable } from 'svelte/store';
import shareKeypair from "./share.js";

const replicaDetails = writable(null);

// Subscribe to the shareKeypair store and update replicaDetails when it changes
shareKeypair.subscribe(value => {
    console.log("shareKeypair store changed:", value);
    const shareAddress = value.shareAddress;
    const secret = value.secret;

    // Use shareAddress and secret to create Replica
    const replica = new Earthstar.Replica({
        // @ts-ignore
        driver: new ReplicaDriverWeb(shareAddress),
        // @ts-ignore
        shareSecret: secret,
    });

    // Update the replicaDetails store
    replicaDetails.set({ replica });
});

export default replicaDetails;
