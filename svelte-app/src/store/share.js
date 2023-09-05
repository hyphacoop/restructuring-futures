import { writable } from 'svelte/store';

const initialKeypair = {
    "shareAddress": import.meta.env.VITE_COMMONS_ADDRESS,
    "secret": import.meta.env.VITE_COMMONS_SECRET
};

const shareKeypair = writable(initialKeypair);

export default shareKeypair;