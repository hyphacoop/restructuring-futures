import * as Earthstar from 'https://deno.land/x/earthstar/mod.ts';

const allKeypairs = [];

async function readInput(question: string): Promise<string> {
    console.log(question);
    const buf = new Uint8Array(1024);
    const n = <number>await Deno.stdin.read(buf);
    return new TextDecoder().decode(buf.subarray(0, n)).trim();
}

async function generateKeypairs() {
    const name = await readInput('Enter the share name:');
    const amountStr = await readInput(`How many ${name}(s) do you want to generate: `);
    const numShares = parseInt(amountStr);
    if (isNaN(numShares)) {
        console.error('Please provide a valid number.');
        return;
    }

    const keypairs = [];

    for (let i = 0; i < numShares; i++) {
        try {
            const result = await Earthstar.Crypto.generateShareKeypair(name);
            if (!result || !result.shareAddress || !result.secret) {
                console.error("Failed to generate valid keypair for", name);
                continue;
            }
            keypairs.push(result);
        } catch (error) {
            console.error("Error generating keypair:", error.message);
        }
    }

    allKeypairs.push(...keypairs);

    console.log("Generated the following keypairs:");
    keypairs.forEach(pair => {
        console.group("Share Keypair:");
        console.log("Share address:", pair.shareAddress);
        console.log("Share secret:", pair.secret);
        console.groupEnd();
    });
}

async function saveKeypairsToFile() {
    const timestamp = new Date().toISOString().replace(/[:\-T]/g, '').split('.')[0];
    const filename = `keypairs_${timestamp}.json`;
    await Deno.writeTextFile(filename, JSON.stringify(allKeypairs, null, 2));
    console.log(`All keypairs saved to ${filename}.`);
}

async function askContinue() {
    const answer = await readInput('Do you want to generate more keypairs? (yes/no):');
    if (answer.match(/^y(es)?$/i)) {
        await generateKeypairs();
        await askContinue();
    } else {
        await saveKeypairsToFile();
    }
}

await generateKeypairs();
await askContinue();