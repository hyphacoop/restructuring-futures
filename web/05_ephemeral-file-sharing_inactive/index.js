import * as Earthstar from "https://cdn.earthstar-project.org/js/earthstar.web.v10.0.0.js";

// if a fresh start is needed, uncomment the following lines to obtain a new chatroom share address and secret
const NEWshareKeypair = await Earthstar.Crypto.generateShareKeypair("filesharing");
console.log(NEWshareKeypair)


// Use the values for shareKeypair which were logged to your console.
const shareKeypair = {
  "shareAddress": "+filesharing.bizqtpoj7py6hf2evdvzhoc6fmuq2b35sviz2ibsuarzqjn6ptnca",
  "secret": "br7jjvhzedght32voqqrad3gjsvadxllgxioat7itqykcrstdssfa"
};

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
document.getElementById("id-text").innerHTML = authorKeypair.address.slice(1, 5);

// Create a new replica. This is where we'll store our documents.
const replica = new Earthstar.Replica({
    driver: new Earthstar.ReplicaDriverWeb(shareKeypair.shareAddress),
    shareSecret: shareKeypair.secret
});


// Read images from replica.
const attachments = document.getElementById("file-attachments");
const fileCache = new Earthstar.ReplicaCache(replica);
async function renderAttachments() {
    attachments.innerHTML = "";

    const fileAttachments = fileCache.queryDocs({
        filter: {
            pathStartsWith: "/images"
        }

    });
    console.log("fileDocs ", fileAttachments);


    for (const doc of fileAttachments) {
        const singleFile = document.createElement("div");
        singleFile.classList.add("img_container");
        const txtAlias = doc.text.slice(0, 5);
        singleFile.innerHTML = txtAlias;
        singleFile.style.backgroundColor = 'rgb(51,51,51)';
        try {
          
        } catch (error) {
          
        }
        const attachment = await replica.getAttachment(doc);
        console.log('doc');
        console.log(doc);
        console.log('attachment');
        console.log(attachment.catch);
        if (attachment.name === "ValidationError") {
            console.log("no attachment!")
            console.log('doc attachment', doc);
        } else {
            console.log('attachment ', attachment);
            const docdata = await attachment.bytes();
            console.log('attachment bytes ', attachment.bytes());
            console.log('docdata ', docdata);
            let bytes = new Uint8Array(docdata.length);
            for (var i = 0; i < docdata.length; i++) {
                bytes[i] = docdata[i];
            }
            console.log("bytes ", bytes);
            let blob = new Blob([bytes])
            console.log("blob ", blob);

            const image = document.createElement("img");
            image.className = "image_view";
            image.src = URL.createObjectURL(new Blob([bytes], {type: 'image/png'} /* (1) */
            ));


            // add time button and function
            const timeButton = document.createElement("button");
            timeButton.classList.add("basicBtn", "addtimeBtn");
            timeButton.innerHTML = "+";
            timeButton.addEventListener("click", async (e) => {
                const deletionTime = doc.deleteAfter;
                const result = await replica.set(authorKeypair, {
                    path: doc.path,
                    deleteAfter: deletionTime + 60000 * 1000
                });
                console.log("new deletion time ", new Date(doc.deleteAfter / 1000));
                console.log("result ", result);
            });

            // remove time button and function
            const rmtimeButton = document.createElement("button");
            rmtimeButton.classList.add("basicBtn", "rmtimeBtn");
            rmtimeButton.innerHTML = "-";
            rmtimeButton.addEventListener("click", async (e) => {
                const deletionTime = doc.deleteAfter;
                const result = await replica.set(authorKeypair, {
                    path: doc.path,
                    deleteAfter: deletionTime - 60000 * 1000
                });
                console.log("new deletion time ", new Date(doc.deleteAfter / 1000));
                console.log("result ", result);
            });

            // add delete button and function
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteBtn", "basicBtn");
            deleteButton.innerHTML = "X";
            deleteButton.addEventListener("click", async (e) => {
                await replica.wipeDocAtPath(authorKeypair, "/images");
                console.log("deleted");
            });
          
            // add second delete button and function
            const deleteButton2 = document.createElement("button");
            deleteButton2.classList.add("deleteBtn", "basicBtn");
            deleteButton2.innerHTML = "XX";
            deleteButton2.addEventListener("click", async (e) => {
              await replica.set(authorKeypair, {
                path: "/images",
                text: "",
              });
            });


            // time affects opacity
            const timeUntil = (doc.deleteAfter -(Date.now() * 1000)) / 60000000;
            console.log("time before deletion", timeUntil.toFixed(2) + "minutes");
            const opacityLevels = timeUntil.toFixed(0) / 60;
            console.log("opacity ", opacityLevels);
            singleFile.style.backgroundColor = 'rgba(51,51,51,' + opacityLevels + ')';
            timeButton.style.backgroundColor = 'rgba(0,128,0,' + opacityLevels + ')';
            rmtimeButton.style.backgroundColor = 'rgba(255,255,0,' + opacityLevels + ')';
            deleteButton.style.backgroundColor = 'rgba(255,0,0,' + opacityLevels + ')';
            deleteButton2.style.backgroundColor = 'rgba(255,0,0,' + opacityLevels + ')';

            if (timeUntil.toFixed(0) < 30) {
                singleFile.style.color = "black";
            }
            if (opacityLevels < 0.25) {
                timeButton.style.color = "black";
                timeButton.style.borderColor = "black";
            }
            const btnDiv = document.createElement("div");
            btnDiv.style.marginLeft = 'auto';
            // add buttons to btn container
            btnDiv.appendChild(timeButton);
            btnDiv.appendChild(rmtimeButton);
            btnDiv.appendChild(deleteButton);
            btnDiv.appendChild(deleteButton2);
            const a = document.createElement('div');
            a.appendChild(image);
            a.appendChild(btnDiv);
            singleFile.append(a);
            attachments.append(singleFile);


            console.log("attachment ", attachment);
        }
    }

}


fileCache.onCacheUpdated(() => {
    renderAttachments();
});

renderAttachments();


const peer = new Earthstar.Peer();
peer.addReplica(replica);

const syncer = peer.sync("https://pacific-festive-azimuth.glitch.me/", true);
const statusText = document.getElementById("status-text");
const otherSyncer = peer.sync("https://earthstar-server.fly.dev/sync", true);
syncer.onStatusChange((newStatus) => {
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
        path: `/images/${
            Date.now()
        }/!${
            file.name
        }`,
        text: authorKeypair.address.slice(1, 5) + " on " + new Date().toLocaleString(),
        attachment: uint8array,
        deleteAfter: deletionTime
    });
    console.log("Result: ", result)
    if (Earthstar.isErr(result)) {
        console.error(result);
    }
}
