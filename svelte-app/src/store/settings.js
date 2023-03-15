import * as Earthstar from 'earthstar';
import { writable } from 'svelte/store'

const settings = new Earthstar.SharedSettings();

const sharedSettings = writable({
    settings
});

export default sharedSettings