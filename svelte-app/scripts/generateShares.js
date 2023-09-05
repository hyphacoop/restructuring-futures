import fs from 'fs';
import readline from 'readline';
import * as Earthstar from 'earthstar';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const allKeypairs = [];

async function generateKeypairs() {
    return new Promise((resolve, reject) => {
        rl.question('Enter the share name: ', async (name) => {
            rl.question(`How many ${name}(s) do you want to generate: `, async (amount) => {
                const numShares = parseInt(amount);
                if (isNaN(numShares)) {
                    console.error('Please provide a valid number.');
                    reject(new Error('Invalid number provided'));
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

                allKeypairs.push(...keypairs);  // Add the keypairs to the session-wide list

                console.log("Generated the following keypairs:");
                keypairs.forEach(pair => {
                    console.group("Share Keypair:");
                    console.log("Share address:", pair.shareAddress);
                    console.log("Share secret:", pair.secret);
                    console.groupEnd();
                });

                resolve();
            });
        });
    });
}

async function saveKeypairsToFile() {
    const timestamp = new Date().toISOString().replace(/[:\-T]/g, '').split('.')[0];
    const filename = `keypairs_${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(allKeypairs, null, 2));
    console.log(`All keypairs saved to ${filename}.`);
}

async function askContinue() {
    rl.question('Do you want to generate more keypairs? (yes/no): ', (answer) => {
        if (answer.match(/^y(es)?$/i)) {
            generateKeypairs().then(askContinue);
        } else {
            saveKeypairsToFile();  // Save all keypairs to file when user decides to stop
            rl.close();
        }
    });
}

generateKeypairs().then(askContinue);