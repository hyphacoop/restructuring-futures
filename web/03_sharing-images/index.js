import * as Earthstar from "https://cdn.earthstar-project.org/js/earthstar.web.v10.0.1.js";

// if a fresh start is needed, uncomment the following lines to obtain a new chatroom share address and secret
//const NEWshareKeypair = await Earthstar.Crypto.generateShareKeypair("chatroom");
//console.log(NEWshareKeypair)


// Use the values for shareKeypair which were logged to your console.
const shareKeypair = {
    
        shareAddress: "+chatroom.b4fjzm5q4qkk363ax4uax7dcixgacevwfgm7jlasngrbp5ufmh7za",
        secret: "bz4vyqt3np4cq3shygcm2zd3qljtdwrczr2usl3l3dar5gup6wouq"

};

// function to generate a valid pseudo-random id
function makeid() {
    var result           = '';
    var alphaCharacter   = 'abcdefghijklmnopqrstuvwxyz';
	var alphaLength = alphaCharacter.length;
    var allCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	var allLength = allCharacters.length;
	result += alphaCharacter.charAt(Math.floor(Math.random() * alphaLength));
    for ( var i = 0; i < 3; i++ ) {
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

// print 
const replica = new Earthstar.Replica({
	driver: new Earthstar.ReplicaDriverWeb(shareKeypair.shareAddress),
	shareSecret: shareKeypair.secret,
});





// Read images from replica.
const attachments = document.getElementById("file-attachments");
const fileCache = new Earthstar.ReplicaCache(replica);
async function renderAttachments() {
	attachments.innerHTML = "";

    const fileAttachments = fileCache.queryDocs({
		filter: { pathStartsWith: "/images" },
        
	});
    console.log("fileDocs ", fileAttachments);


	for (const doc of fileAttachments) {
		const singleFile = document.createElement("div");
        singleFile.classList.add("img_container");
        const attachment = await replica.getAttachment(doc);
        if (attachment === undefined) {
            console.log("no image attachment?")
            console.log('doc attachment', doc);
        } else {
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
        let reader = new FileReader();
        reader.readAsDataURL(blob); // converts the blob to base64 and calls onload

        reader.onload = function() {
        console.log('reader result: ' + reader.result);
        console.log('reader.result type: ' + typeof reader.result);
/*         if (type === "jpg") {
        imageData = "data:image/jpeg;base64," + reader.result.split(',')[1]; }
        else if (type === "png") { */
        let imageData = "data:image/png;base64," + reader.result.split(',')[1]; 
        const image = document.createElement("img");
        image.className = "image_view";
        image.src = URL.createObjectURL(
            new Blob([bytes], { type: 'image/png' } /* (1) */)
          );        
        const a = document.createElement('div');
        a.appendChild(image);
        singleFile.append(a);
		attachments.append(singleFile);
        


        console.log("attachment ", attachment);
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

const syncer = peer.sync("https://abstracted-mire-starburst.glitch.me/", true);
const statusText = document.getElementById("status-text");

syncer.onStatusChange((newStatus) => {
  console.log(newStatus);
});

syncer.isDone().then(() => {
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
        return new Promise((resolve, reject) => {
          // Create file reader
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
        const result = await replica.set(authorKeypair, {
            path: `/images/~${authorKeypair.address}/${Date.now()}/${file.name}`,
            text: authorKeypair.address.slice(1, 5) + " on " + new Date().toLocaleString(),
            attachment: uint8array,
          });
          console.log("Result: ", result)
        if (Earthstar.isErr(result)) {
            console.error(result);
        }
    }
