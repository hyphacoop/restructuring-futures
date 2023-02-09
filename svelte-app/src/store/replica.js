import * as Earthstar from "../assets/scripts/earthstar";
import { readable } from 'svelte/store'
import shareKeypair from "../store/share";

let shareDetails;

shareKeypair.subscribe(value => {
    shareDetails = value;
});

const replica = new Earthstar.Replica({
    // @ts-ignore
    driver: new Earthstar.ReplicaDriverWeb(shareDetails.shareAddress),
    // @ts-ignore
    shareSecret: shareDetails.secret,
});


const replicaDetails = readable({
    replica
});

export default replicaDetails