import * as Earthstar from "https://cdn.earthstar-project.org/js/earthstar.web.v10.0.0.js";
import { replica, authorKeypair } from "./earthstar.js";
import { timeButtons } from "./ephemeral.js";
import { renderImage } from "./imageview.js";
// if a fresh start is needed, uncomment the following lines to obtain a new chatroom share address and secret
const NEWshareKeypair = await Earthstar.Crypto.generateShareKeypair("filesharing");
console.log(NEWshareKeypair)




// print authorKeypair to page
document.getElementById("id-text").innerHTML = authorKeypair.address.slice(1, 5);

/* // Create a new replica. This is where we'll store our documents.
const replica = new Earthstar.Replica({
    driver: new Earthstar.ReplicaDriverWeb(shareKeypair.shareAddress),
    shareSecret: shareKeypair.secret
}); */


// add or remove time functions




// Read files from replica.
const attachments = document.getElementById("file-attachments");
const fileCache = new Earthstar.ReplicaCache(replica);
async function renderAttachments() {
    attachments.innerHTML = "";

    const fileAttachments = fileCache.queryDocs({
        filter: {
            pathStartsWith: "/files"
        }

    });
    console.log("fileDocs ", fileAttachments);


    for (const doc of fileAttachments) {
        console.log(doc.text.length);
        if (doc.text.length > 1) {
        const singleFile = document.createElement("div");
        singleFile.classList.add("img_container");
        console.log(doc)
        const dAuthor = doc.text.split("@");
        console.log(dAuthor);
        const authorAlias = dAuthor[1].split(' '); 
        console.log('authorAlias');
        const shortAlias = authorAlias[0];
        console.log('shortAlias')
        singleFile.innerHTML = shortAlias;
        singleFile.style.backgroundColor = 'rgb(51,51,51)';
        const attachment = await replica.getAttachment(doc);
        console.log('doc');
        console.log(doc);
        singleFile.appendChild(timeButtons(doc));
        console.log('attachment type ', typeof attachment);
        console.log('attachment keys ', Object.keys(attachment));
        const docdata = attachment.bytes();

    if (attachment !== undefined && attachment !== null) {
        console.log('1');
        try {
            console.log('2');
            if (doc.path.endsWith(".png") || doc.path.endsWith(".jpg") || doc.path.endsWith(".jpeg") || doc.path.endsWith(".gif")) {

                console.log('3');
                singleFile.appendChild(renderImage(docdata));

            } else if (doc.path.endsWith(".mp4") || doc.path.endsWith(".mov") || doc.path.endsWith(".avi") || doc.path.endsWith(".webm")) {
                // code for video
            } else if (doc.path.endsWith(".mp3") || doc.path.endsWith(".wav") || doc.path.endsWith(".ogg")) {
                // code for audio
            } else if (doc.path.endsWith(".txt")) {
                // code for text
            }
            
            attachments.appendChild(singleFile);
        
    } 
    catch (err) {

    console.error("error getting attachment", err);
}
    }
}
}
}
    

fileCache.onCacheUpdated(() => {
    renderAttachments();
});

renderAttachments();


const peer = new Earthstar.Peer();
peer.addReplica(replica);
/* 
const syncer = peer.sync("https://pacific-festive-azimuth.glitch.me/", true);
const statusText = document.getElementById("status-text");
const otherSyncer = peer.sync("https://earthstar-server.fly.dev/sync", true); */
/*syncer.onStatusChange((newStatus) => { 
    console.log(newStatus);
});

syncer.isDone().then(() => {
    console.log("Sync complete");
}).catch((err) => {
    console.error("Sync failed", err);
    statusText.innerHTML = "Sync failed" + JSON.stringify(err);
});

otherSyncer.onStatusChange((newStatus) => {
    console.log(newStatus);
});

otherSyncer.isDone().then(() => {
    console.log("Sync complete");
}).catch((err) => {
    console.error("Sync failed", err);
    statusText.innerHTML = "Sync failed" + JSON.stringify(err);
});
  */

// get file from disk to uint8array
async function getAsByteArray(file) {
    return new Uint8Array(await readFile(file))
}

// read file from disk
function readFile(file) {
    return new Promise((resolve, reject) => { // Create file reader
        let reader = new FileReader()

        // Register event listeners
        reader.addEventListener("loadend", e => resolve(e.target.result))
        reader.addEventListener("error", reject)

        // Read file
        reader.readAsArrayBuffer(file)
    })
}


// upload file from disk
document.getElementById("uploadButton").onclick = async () => {
    let fileElement = document.getElementById('fileInput')

    // check if user had selected a file
    if (fileElement.files.length === 0) {
        alert('please choose a file')
        return
    }

    let file = fileElement.files[0]
    console.log("file: ", file);
    // convert file to uint8array
    let uint8array = await getAsByteArray(file);
    // upload file to server
    var deletionTime = (Date.now() + 600000) * 1000;
    const result = await replica.set(authorKeypair, {
        path: `/files/${
            Date.now()
        }/!${
            file.name
        }`,
        text: file.type + ' from ' + authorKeypair.address.slice(0, 5) + " on " + new Date().toLocaleString(),
        attachment: uint8array,
        deleteAfter: deletionTime
    });
    console.log("Result: ", result)
    if (Earthstar.isErr(result)) {
        console.error(result);
    }
}

