import { writable } from 'svelte/store';

const initialKeypair = {
    "shareAddress": "+commons.b7q4gt64yiefosdafnmhvtxz43akzk6gw54aesdahtf4kdgpbyeia",
    "secret": "bigzorlvyjy5fy5a3kglfzcyfzramsic3cihj4rqphmd6x5wo5jcq"
};

const shareKeypair = writable(initialKeypair);

export default shareKeypair;