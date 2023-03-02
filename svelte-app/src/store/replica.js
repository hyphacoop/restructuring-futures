import * as Earthstar from 'earthstar';
import { ReplicaDriverWeb } from "earthstar/browser";
import { readable } from 'svelte/store'
import shareKeypair from "./share.js";

let shareDetails;

shareKeypair.subscribe(value => {
    shareDetails = value;
});

const replica = new Earthstar.Replica({
    // @ts-ignore
    driver: new ReplicaDriverWeb(shareDetails.shareAddress),
    // @ts-ignore
    shareSecret: shareDetails.secret,
});


const replicaDetails = readable({
    replica
});

export default replicaDetails