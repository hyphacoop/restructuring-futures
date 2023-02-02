import * as Earthstar from "https://cdn.earthstar-project.org/js/earthstar.web.v10.0.1.js";

const shareKeypair = {
    "shareAddress": "+time.bcf7dnfnkdpr7426bmtvlsiwoz6hbof7mdkpglei3ijhxm6krsa2a",
    "secret": "bi7zyrigu53wp666nfnguxl3exagkj7v4a3eqn4hqqz7wyrakvola"
}


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
let authorKeypair = await Earthstar.Crypto.generateAuthorKeypair(makeid());
// print authorKeypair to console
console.log("authorKeypair ", authorKeypair)
// print authorKeypair to page
document.getElementById("userID").innerHTML =  `&nbsp;<strong>` + authorKeypair.address.slice(1, 5) + `</strong>`;
// print
const replica = new Earthstar.Replica({
    driver: new Earthstar.ReplicaDriverWeb(shareKeypair.shareAddress),
    shareSecret: shareKeypair.secret
});

const input = document.getElementById("message-input");

// Send messages to chat.
async function sendMessages(deletionTime) {
    console.log("deletionTime ", deletionTime)
    // Write the contents of the message to the replica.
    const alias = authorKeypair.address.slice(1, 5);
    const result = await replica.set(authorKeypair, {
        path: `/chat/${
            Date.now()
        }!`,
        text: alias + ": " + input.value,
        deleteAfter: deletionTime
    });
    console.log("result ", result);

    if (Earthstar.isErr(result)) {
        console.error(result);
    }

    input.value = "";

};

document.getElementById("sendButton").addEventListener("click", function (e) {
    e.preventDefault();
    var deletionTime = (Date.now() + 600000) * 1000;
    sendMessages(deletionTime);
});


// Read messages from chat.
const messages = document.getElementById("messages");

const cache = new Earthstar.ReplicaCache(replica);

function renderMessages() {
    messages.innerHTML = "";

    const chatDocs = cache.queryDocs({
        filter: {
            pathStartsWith: "/chat"
        }

    });
    for (const doc of chatDocs) {
        const message = document.createElement("li");
        const alias = doc.author.slice(1, 5);
        const txtAlias = doc.text.slice(0, 5);
        const txtOnly = doc.text.slice(5);
        const fullname = doc.author;
        const identicon = `<svg data-jdenticon-value="` + fullname + 
        `" width="80" height="80">
            Fallback text or image for browsers not supporting inline svg.
        </svg>`
        if (doc.text === "") {
            continue;
        }
        console.log('doctext ', doc.text);
        message.innerHTML = identicon + `<strong>` + txtAlias +  `</strong> ` + txtOnly;
        // add time button and function
        const timeButton = document.createElement("button");
        timeButton.classList.add("timeBtn");
        timeButton.innerHTML = "Add 1 minute";
        timeButton.addEventListener("click", async (e) => {
            const deletionTime = doc.deleteAfter;
            const result = await replica.set(authorKeypair, {
                path: doc.path,
                deleteAfter: deletionTime + 60000 * 1000
            });
            console.log("new deletion time ", new Date(doc.deleteAfter / 1000));
            console.log("result ", result);
        });

        // time affects opacity
        const timeUntil = (doc.deleteAfter - (Date.now() * 1000)) / 60000000;
        console.log("time before deletion", timeUntil.toFixed(2) + "minutes");
        const opacityLevels = timeUntil.toFixed(0) / 60;
        console.log("opacity ", opacityLevels);
        message.style.backgroundColor = 'rgba(51,51,51,' + opacityLevels +')';
        
        if (timeUntil.toFixed(0) < 30) {
            message.style.color = "black";
        }
        message.appendChild(timeButton);

        messages.append(message);
    }
}

cache.onCacheUpdated(() => {
    renderMessages();
});

renderMessages();


const peer = new Earthstar.Peer();
peer.addReplica(replica);
const syncStatus = peer.sync("https://western-shade-umbrella.glitch.me/", true);


syncStatus.onStatusChange((newStatus) => {
    console.log(newStatus);
});

const statusText = document.getElementById("statusText");

syncStatus.isDone().then(() => {
    console.log("Sync complete");
}).catch((err) => {
    console.error("Sync failed", err);
    statusText.innerHTML = "Sync failed" + JSON.stringify(err);
});