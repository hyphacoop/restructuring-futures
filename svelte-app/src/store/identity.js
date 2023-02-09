import { writable } from 'svelte/store'

const authorKeypair = writable({
    "address": "",
    "secret": ""
  });

export default authorKeypair