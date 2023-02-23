import * as Earthstar from "../assets/scripts/earthstar";
import { readable } from 'svelte/store'
import replica from "./replica";

let replicaDetails;

replica.subscribe(value => {
    replicaDetails = value;
});

const cache = new Earthstar.ReplicaCache(replicaDetails.replica)

const cacheDetails = readable({
    cache
});

export default cacheDetails;