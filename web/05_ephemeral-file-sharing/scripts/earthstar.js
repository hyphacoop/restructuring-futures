import * as Earthstar from "https://cdn.earthstar-project.org/js/earthstar.web.v10.0.0.js";


// function to generate a valid pseudo-random id
function makeid() {
    var result = '';
    var alphaCharacter = 'abcdefghijklmnopqrstuvwxyz';
    var alphaLength = alphaCharacter.length;
    var allCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var allLength = allCharacters.length;
    result += alphaCharacter.charAt(Math.floor(Math.random() * alphaLength));
    for (var i = 0; i < 3; i++) {
        result += allCharacters.charAt(Math.floor(Math.random() * allLength));
    }
    return result;
}

// Create a new author keypair with a random id.
export const authorKeypair = await Earthstar.Crypto.generateAuthorKeypair(makeid());
// print authorKeypair to console
console.log("authorKeypair ", authorKeypair);


// Use the values for shareKeypair which were logged to your console.
export const shareKeypair = {
    "shareAddress": "+filesharing.bizqtpoj7py6hf2evdvzhoc6fmuq2b35sviz2ibsuarzqjn6ptnca",
    "secret": "br7jjvhzedght32voqqrad3gjsvadxllgxioat7itqykcrstdssfa"
  };
  

// Create a new replica. This is where we'll store our documents.
export const replica = new Earthstar.Replica({
    driver: new Earthstar.ReplicaDriverWeb(shareKeypair.shareAddress),
    shareSecret: shareKeypair.secret
});
