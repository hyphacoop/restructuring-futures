import { writable } from 'svelte/store';

const initialKeypair = {
    "shareAddress": "+commons.bx74mp53odwosieejh5hfxfv26c35qbzenelstspygcpalbusyo3q",
    "secret": "bjwms5f5ywnkbg7fjn3imwpdax4gyce3laock3idyg6eekgq54c6a"
};

const shareKeypair = writable(initialKeypair);

export default shareKeypair;