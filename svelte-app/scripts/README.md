# Earthstar Keypair Generation Scripts

This directory (`svelte-app/scripts`) contains two scripts for generating Earthstar keypairs:

1. **generateShare.ts** - A script designed for [Deno](https://deno.land/).
2. **generateShare.js** - A script tailored for [Node.js](https://nodejs.org/).

## Usage

### Using Deno:

1. Ensure [Deno](https://deno.land/#installation) is installed on your machine.
2. Open a terminal and navigate to the `svelte-app/scripts` directory.
3. Execute the Deno script using the following command:

   ```
   deno run --allow-read --allow-write generateShare.ts
   ```


### Using Node.js:

1. Ensure Node.js is installed on your machine.

2. Open a terminal and navigate to the svelte-app/scripts directory.

3. Execute the Node.js script using the following command:

    ```
    node generateShare.js
    ```


After running the respective scripts, you'll be prompted to input the share name and specify how many keypairs you wish to generate. The generated keypairs will be saved in a unique JSON file inside the svelte-app/scripts directory.