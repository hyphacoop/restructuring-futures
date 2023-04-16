import * as Earthstar from "https://cdn.earthstar-project.org/js/earthstar.web.v10.0.1.js";

// if a fresh start is needed, uncomment the following lines to obtain a new chatroom share address and secret
const NEWshareKeypair = await Earthstar.Crypto.generateShareKeypair("commons");
console.log(NEWshareKeypair)


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
document.getElementById("identity-info").innerHTML += 
'Address: ' + authorKeypair.address + '<br>Secret: ' + authorKeypair.secret;
// print 
const replica = new Earthstar.Replica({
	driver: new Earthstar.ReplicaDriverWeb(shareKeypair.shareAddress),
	shareSecret: shareKeypair.secret,
});

const form = document.getElementById("message-form");
const input = document.getElementById("message-input");
const idForm = document.getElementById("id-form");
const idInput = document.getElementById("id-input");
const deleteButton = document.getElementById("delete_button");

// Delete messages from chat.
deleteButton.addEventListener("click", async (event) => {
    // This stops the page from reloading.
    event.preventDefault();
    const result = await replica.set(authorKeypair, {
        path: "/chat",
        text: "",
      });
    //const result = await replica.wipeDocAtPath(authorKeypair, "/chat");

	if (Earthstar.isErr(result)) {
		console.error(result);
	}
});

// Send messages to chat.
async function sendMessages(deletionTime) {
    console.log("deletionTime ", deletionTime)
    // Write the contents of the message to the replica.
    const alias = authorKeypair.address.slice(1, 5);
    const result = await replica.set(authorKeypair, {
        path: `/chat/${Date.now()}!`,
        text: input.value,
        deleteAfter: deletionTime,
    });
    console.log("result ", result);

	if (Earthstar.isErr(result)) {
		console.error(result);
	}

	input.value = "";

};

// Different buttons for different delete times.
document.getElementById("secondsButton").addEventListener("click", function(e) {
    e.preventDefault();
    var deletionTime = (Date.now() + 10000) * 1000;
    sendMessages(deletionTime);
});
document.getElementById("minutesButton").addEventListener("click", function(e){
    e.preventDefault();
    var deletionTime = (Date.now() + 600000) * 1000;
    sendMessages(deletionTime);
});
document.getElementById("hoursButton").addEventListener("click", function(e){
    e.preventDefault();
    var deletionTime = (Date.now() + 36000000) * 1000;
    sendMessages(deletionTime);
});

// Read messages from chat.
const messages = document.getElementById("messages");

const cache = new Earthstar.ReplicaCache(replica);

function renderMessages() {
	messages.innerHTML = "";

	const chatDocs = cache.queryDocs({
		filter: { pathStartsWith: "/chat" },
        
	});
	for (const doc of chatDocs) {
		const message = document.createElement("li");
        const alias = doc.author.slice(1, 5);
        const fullname = doc.author;
        const identicon = `<svg data-jdenticon-value="` + fullname +`" width="80" height="80">
    Fallback text or image for browsers not supporting inline svg.
</svg>`
        if(doc.text === ""){ continue; }
        console.log('doctext ', doc.text);
        message.innerHTML = `<strong>` + alias + identicon + `</strong> ` + doc.text;

		messages.append(message);
	}
}

// Read voice notes from replica.
const voiceNotes = document.getElementById("voice-notes");
const voiceCache = new Earthstar.ReplicaCache(replica);

async function renderVoiceNotes() {
	voiceNotes.innerHTML = "";

    const voiceDocs = voiceCache.queryDocs({
		filter: { pathStartsWith: "/voice" },
        
	});
    console.log("voiceDocs ", voiceDocs);


	for (const doc of voiceDocs) {
		const note = document.createElement("li");
        const attachment = await replica.getAttachment(doc);
        if (attachment === undefined) {
            console.log("undefined voice attachment")
            continue;
        } 
        const docdata = await attachment.bytes();
        let bytes = new Uint8Array(docdata.length);
        for (var i = 0; i < docdata.length; i++) {
            bytes[i] = docdata[i];
        }
        console.log("voice attachment ", attachment);
        const blob = URL.createObjectURL(new Blob([bytes], {type: "audio/ogg"}));

        const a = document.createElement('a');
        a.href = blob;
        a.innerHTML = doc.text;
        note.append(a);
		voiceNotes.append(note);

	}
}


// Read attachments from replica.
const attachments = document.getElementById("file-attachments");
const fileCache = new Earthstar.ReplicaCache(replica);
async function renderAttachments() {
	attachments.innerHTML = "";

    const fileAttachments = fileCache.queryDocs({
		filter: { pathStartsWith: "/attachments" },
        
	});
    console.log("fileDocs ", fileAttachments);


	for (const doc of fileAttachments) {
		const singleFile = document.createElement("li");
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
        a.innerHTML = doc.text;
        a.appendChild(image);
        singleFile.append(a);
		attachments.append(singleFile);
        


        console.log("attachment ", attachment);
    }
        }

	}
}



// Create new Identity.
idForm.addEventListener("submit", async (event) => {
	// This stops the page from reloading.
	event.preventDefault();

	//Creates a new ID.
    const newAuthorKeypair = await Earthstar.Crypto.generateAuthorKeypair(idInput.value);
	
	if (Earthstar.notErr(newAuthorKeypair)) {
        console.group("Author keypair");
        console.log(newAuthorKeypair);
        console.groupEnd();
        authorKeypair = newAuthorKeypair;
        document.getElementById("id-text").innerHTML = authorKeypair.address.slice(1, 5);
        document.getElementById("identity-info").innerHTML += 
        '<br>***<br>Address: ' + authorKeypair.address + '<br>Secret: ' + authorKeypair.secret;
     } else if (Earthstar.isErr(newAuthorKeypair)) {
        console.error(newAuthorKeypair);
        document.getElementById("identity").appendChild(document.createTextNode("Error: " + newAuthorKeypair)); 
        
    }
});

// Create random ID.
const randomButton = document.getElementById("randomID");
randomButton.addEventListener("click", async (event) => {
    
	// This stops the page from reloading.
	event.preventDefault();

	//Creates a new ID.
    const newAuthorKeypair = await Earthstar.Crypto.generateAuthorKeypair(makeid());
	
	if (Earthstar.notErr(newAuthorKeypair)) {
        console.group("Author keypair");
        console.log(newAuthorKeypair);
        console.groupEnd();
        authorKeypair = newAuthorKeypair;
        document.getElementById("id-text").innerHTML = authorKeypair.address.slice(1, 5);
        document.getElementById("identity-info").innerHTML += 
        '<br>***<br>Address: ' + authorKeypair.address + '<br>Secret: ' + authorKeypair.secret;
     } else if (Earthstar.isErr(newAuthorKeypair)) {
        console.error(newAuthorKeypair);
    }
});


cache.onCacheUpdated(() => {
	renderMessages();
});


renderMessages();




const peer = new Earthstar.Peer();
peer.addReplica(replica);


const syncer = peer.sync("https://pacific-festive-azimuth.glitch.me/");
const statusText = document.getElementById("status-text");

const otherSyncer = peer.sync("https://earthstar-server.fly.dev/sync", true);

syncer.onStatusChange((newStatus) => {
  console.log(newStatus);
});

syncer.isDone().then(() => {
    renderVoiceNotes();
  console.log("Sync complete");
}).catch((err) => {
  console.error("Sync failed", err);
  statusText.innerHTML = "Sync failed" + JSON.stringify(err);
});

otherSyncer.onStatusChange((newStatus) => {
    console.log("Sync complete w earthstar-server.fly.dev")
    console.log(newStatus);
    console.log("End sync status data from earthstar-server.fly.dev")
  });
  
  otherSyncer.isDone().then(() => {
    console.log("Sync complete w earthstar-server.fly.dev");
  }).catch((err) => {
    console.error("Sync failed", err);
    statusText.innerHTML = "Sync failed w earthstar-server.fly" + JSON.stringify(err);
  });


//Model 
//none

//View
var microphoneButton = document.getElementsByClassName("start-recording-button")[0];
var recordingControlButtonsContainer = document.getElementsByClassName("recording-contorl-buttons-container")[0];
var stopRecordingButton = document.getElementsByClassName("stop-recording-button")[0];
var cancelRecordingButton = document.getElementsByClassName("cancel-recording-button")[0];
var elapsedTimeTag = document.getElementsByClassName("elapsed-time")[0];
var closeBrowserNotSupportedBoxButton = document.getElementsByClassName("close-browser-not-supported-box")[0];
var overlay = document.getElementsByClassName("overlay")[0];
var audioElement = document.getElementsByClassName("audio-element")[0];
var audioElementSource = document.getElementsByClassName("audio-element")[0]
    .getElementsByTagName("source")[0];
var textIndicatorOfAudiPlaying = document.getElementsByClassName("text-indication-of-audio-playing")[0];

//Listeners

//Listen to start recording button
microphoneButton.onclick = startAudioRecording;

//Listen to stop recording button
stopRecordingButton.onclick = stopAudioRecording;

//Listen to cancel recording button
cancelRecordingButton.onclick = cancelAudioRecording;

//Listen to when the ok button is clicked in the browser not supporting audio recording box
closeBrowserNotSupportedBoxButton.onclick = hideBrowserNotSupportedOverlay;

//Listen to when the audio being played ends
audioElement.onended = hideTextIndicatorOfAudioPlaying;

/** Displays recording control buttons */
function handleDisplayingRecordingControlButtons() {
    //Hide the microphone button that starts audio recording
    microphoneButton.style.display = "none";

    //Display the recording control buttons
    recordingControlButtonsContainer.classList.remove("hide");

    //Handle the displaying of the elapsed recording time
    handleElapsedRecordingTime();
}

/** Hide the displayed recording control buttons */
function handleHidingRecordingControlButtons() {
    //Display the microphone button that starts audio recording
    microphoneButton.style.display = "block";

    //Hide the recording control buttons
    recordingControlButtonsContainer.classList.add("hide");

    //stop interval that handles both time elapsed and the red dot
    clearInterval(elapsedTimeTimer);
}

/** Displays browser not supported info box for the user*/
function displayBrowserNotSupportedOverlay() {
    overlay.classList.remove("hide");
}

/** Displays browser not supported info box for the user*/
function hideBrowserNotSupportedOverlay() {
    overlay.classList.add("hide");
}

/** Creates a source element for the the audio element in the HTML document*/
function createSourceForAudioElement() {
    let sourceElement = document.createElement("source");
    audioElement.appendChild(sourceElement);

    audioElementSource = sourceElement;
}

/** Display the text indicator of the audio being playing in the background */
function displayTextIndicatorOfAudioPlaying() {
    textIndicatorOfAudiPlaying.classList.remove("hide");
}

/** Hide the text indicator of the audio being playing in the background */
function hideTextIndicatorOfAudioPlaying() {
    textIndicatorOfAudiPlaying.classList.add("hide");
}

//Controller

/** Stores the actual start time when an audio recording begins to take place to ensure elapsed time start time is accurate*/
var audioRecordStartTime;

/** Stores the maximum recording time in hours to stop recording once maximum recording hour has been reached */
var maximumRecordingTimeInHours = 1;

/** Stores the reference of the setInterval function that controls the timer in audio recording*/
var elapsedTimeTimer;

/** Starts the audio recording*/
function startAudioRecording() {

    console.log("Recording Audio...");

    //If a previous audio recording is playing, pause it
    let recorderAudioIsPlaying = !audioElement.paused; // the paused property tells whether the media element is paused or not
    console.log("paused?", !recorderAudioIsPlaying);
    if (recorderAudioIsPlaying) {
        audioElement.pause();
        //also hide the audio playing indicator displayed on the screen
        hideTextIndicatorOfAudioPlaying();
    }

    //start recording using the audio recording API
    audioRecorder.start()
        .then(() => { //on success

            //store the recording start time to display the elapsed time according to it
            audioRecordStartTime = new Date();

            //display control buttons to offer the functionality of stop and cancel
            handleDisplayingRecordingControlButtons();
        })
        .catch(error => { //on error
            //No Browser Support Error
            if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {
                console.log("To record audio, use browsers like Chrome and Firefox.");
                displayBrowserNotSupportedOverlay();
            }

            //Error handling structure
            switch (error.name) {
                case 'AbortError': //error from navigator.mediaDevices.getUserMedia
                    console.log("An AbortError has occured.");
                    break;
                case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotAllowedError has occured. User might have denied permission.");
                    break;
                case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotFoundError has occured.");
                    break;
                case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotReadableError has occured.");
                    break;
                case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
                    console.log("A SecurityError has occured.");
                    break;
                case 'TypeError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A TypeError has occured.");
                    break;
                case 'InvalidStateError': //error from the MediaRecorder.start
                    console.log("An InvalidStateError has occured.");
                    break;
                case 'UnknownError': //error from the MediaRecorder.start
                    console.log("An UnknownError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            };
        });
}

    // get file from disk to uint8array
    async function getAsByteArray(file) {
        return new Uint8Array(await readFile(file))
    }

    // convert blob to uint8array
    async function blob2uint(blob){
        const buffer = await new Response(blob).arrayBuffer();
        const uint = [...new Uint8Array(buffer)];
        console.log('blob ', blob);
        console.log("uint8array: ", uint);
        console.log("type: ", typeof uint);
        return uint;
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
            text: authorKeypair.address.slice(1, 5),
            attachment: uint8array,
          });
          console.log("Result: ", result)
        if (Earthstar.isErr(result)) {
            console.error(result);
        }
    }

// async function to upload document to server
async function uploadDocumentToServer(audioAsblob) {
try {
    
        console.log("type: ", audioAsblob.type)
        var type = audioAsblob.type;
        var withoutCodecs = type.split(";")[0];
        var extension = withoutCodecs.split("/")[1];
        console.log("extension: ", extension);
        var file = new File([audioAsblob], "voice-note" + "." + extension, {type: type});
        console.log("file: ", file);
        let myuint8array = await getAsByteArray(file);
        console.log("audioBlob: " + audioAsblob);
        console.log("myuint8array: " + myuint8array);
        const result = await replica.set(authorKeypair, {
            path: `/voice/~${authorKeypair.address}/${Date.now()}/voice-note.${extension}`,
            text: "A voice note by " + authorKeypair.address.slice(1, 5) + " at " + new Date().toLocaleString(),
            attachment: myuint8array,
          });
          console.log("Result: ", result)
        if (Earthstar.isErr(result)) {
            console.error(result);
        }

        console.log('Audio sent to server.')
    } catch (error) {
        console.log("Error uploading audio to server: ", error);
    }
}
/** Stop the currently started audio recording & sends it
 */
function stopAudioRecording() {

    console.log("Stopping Audio Recording...");

    //stop the recording using the audio recording API
    audioRecorder.stop()
        .then(audioAsblob => {
            //Play recorder audio
            playAudio(audioAsblob);
            //hide recording control button & return record icon
            handleHidingRecordingControlButtons();

            uploadDocumentToServer(audioAsblob);

        })
        .catch(error => {
            //Error handling structure
            switch (error.name) {
                case 'InvalidStateError': //error from the MediaRecorder.stop
                    console.log("An InvalidStateError has occured.");
                    break;
                default:
                    console.log('error ', error);
                    console.log("An error occured with the error name " + error.name);
            };
        });
}

/** Cancel the currently started audio recording */
function cancelAudioRecording() {
    console.log("Canceling audio...");

    //cancel the recording using the audio recording API
    audioRecorder.cancel();

    //hide recording control button & return record icon
    handleHidingRecordingControlButtons();
}

/** Plays recorded audio using the audio element in the HTML document
 * @param {Blob} recorderAudioAsBlob - recorded audio as a Blob Object 
*/
function playAudio(recorderAudioAsBlob) {

    //read content of files (Blobs) asynchronously
    let reader = new FileReader();

    //once content has been read
    reader.onload = (e) => {
        //store the base64 URL that represents the URL of the recording audio
        let base64URL = e.target.result;

        //If this is the first audio playing, create a source element
        //as pre populating the HTML with a source of empty src causes error
        if (!audioElementSource) //if its not defined create it (happens first time only)
            createSourceForAudioElement();

        //set the audio element's source using the base64 URL
        audioElementSource.src = base64URL;

        //set the type of the audio element based on the recorded audio's Blob type
        let BlobType = recorderAudioAsBlob.type.includes(";") ?
            recorderAudioAsBlob.type.substr(0, recorderAudioAsBlob.type.indexOf(';')) : recorderAudioAsBlob.type;
        audioElementSource.type = BlobType

        //call the load method as it is used to update the audio element after changing the source or other settings
        audioElement.load();

        //play the audio after successfully setting new src and type that corresponds to the recorded audio
        console.log("Playing audio...");
        audioElement.play();

        //Display text indicator of having the audio play in the background
        displayTextIndicatorOfAudioPlaying();
    };

    //read content and convert it to a URL (base64)
    reader.readAsDataURL(recorderAudioAsBlob);
}

/** Computes the elapsed recording time since the moment the function is called in the format h:m:s*/
function handleElapsedRecordingTime() {
    //display inital time when recording begins
    displayElapsedTimeDuringAudioRecording("00:00");

    //create an interval that compute & displays elapsed time, as well as, animate red dot - every second
    elapsedTimeTimer = setInterval(() => {
        //compute the elapsed time every second
        let elapsedTime = computeElapsedTime(audioRecordStartTime); //pass the actual record start time
        //display the elapsed time
        displayElapsedTimeDuringAudioRecording(elapsedTime);
    }, 1000); //every second
}

/** Display elapsed time during audio recording
 * @param {String} elapsedTime - elapsed time in the format mm:ss or hh:mm:ss 
 */
function displayElapsedTimeDuringAudioRecording(elapsedTime) {
    //1. display the passed elapsed time as the elapsed time in the elapsedTime HTML element
    elapsedTimeTag.innerHTML = elapsedTime;

    //2. Stop the recording when the max number of hours is reached
    if (elapsedTimeReachedMaximumNumberOfHours(elapsedTime)) {
        stopAudioRecording();
    }
}

/**
 * @param {String} elapsedTime - elapsed time in the format mm:ss or hh:mm:ss  
 * @returns {Boolean} whether the elapsed time reached the maximum number of hours or not
 */
function elapsedTimeReachedMaximumNumberOfHours(elapsedTime) {
    //Split the elapsed time by the symbo :
    let elapsedTimeSplitted = elapsedTime.split(":");

    //Turn the maximum recording time in hours to a string and pad it with zero if less than 10
    let maximumRecordingTimeInHoursAsString = maximumRecordingTimeInHours < 10 ? "0" + maximumRecordingTimeInHours : maximumRecordingTimeInHours.toString();

    //if it the elapsed time reach hours and also reach the maximum recording time in hours return true
    if (elapsedTimeSplitted.length === 3 && elapsedTimeSplitted[0] === maximumRecordingTimeInHoursAsString)
        return true;
    else //otherwise, return false
        return false;
}

/** Computes the elapsedTime since the moment the function is called in the format mm:ss or hh:mm:ss
 * @param {String} startTime - start time to compute the elapsed time since
 * @returns {String} elapsed time in mm:ss format or hh:mm:ss format, if elapsed hours are 0.
 */
function computeElapsedTime(startTime) {
    //record end time
    let endTime = new Date();

    //time difference in ms
    let timeDiff = endTime - startTime;

    //convert time difference from ms to seconds
    timeDiff = timeDiff / 1000;

    //extract integer seconds that dont form a minute using %
    let seconds = Math.floor(timeDiff % 60); //ignoring uncomplete seconds (floor)

    //pad seconds with a zero if neccessary
    seconds = seconds < 10 ? "0" + seconds : seconds;

    //convert time difference from seconds to minutes using %
    timeDiff = Math.floor(timeDiff / 60);

    //extract integer minutes that don't form an hour using %
    let minutes = timeDiff % 60; //no need to floor possible incomplete minutes, becase they've been handled as seconds
    minutes = minutes < 10 ? "0" + minutes : minutes;

    //convert time difference from minutes to hours
    timeDiff = Math.floor(timeDiff / 60);

    //extract integer hours that don't form a day using %
    let hours = timeDiff % 24; //no need to floor possible incomplete hours, becase they've been handled as seconds

    //convert time difference from hours to days
    timeDiff = Math.floor(timeDiff / 24);

    // the rest of timeDiff is number of days
    let days = timeDiff; //add days to hours

    let totalHours = hours + (days * 24);
    totalHours = totalHours < 10 ? "0" + totalHours : totalHours;

    if (totalHours === "00") {
        return minutes + ":" + seconds;
    } else {
        return totalHours + ":" + minutes + ":" + seconds;
    }
}

//API to handle audio recording 

var audioRecorder = {
    /** Stores the recorded audio as Blob objects of audio data as the recording continues*/
    audioBlobs: [],/*of type Blob[]*/
    /** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts*/
    mediaRecorder: null, /*of type MediaRecorder*/
    /** Stores the reference to the stream currently capturing the audio*/
    streamBeingCaptured: null, /*of type MediaStream*/
    /** Start recording the audio 
     * @returns {Promise} - returns a promise that resolves if audio recording successfully started
     */
    start: function () {
        //Feature Detection
        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            //Feature is not supported in browser
            //return a custom error
            return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
        }

        else {
            //Feature is supported in browser

            //create an audio stream
            return navigator.mediaDevices.getUserMedia({ audio: true }/*of type MediaStreamConstraints*/)
                //returns a promise that resolves to the audio stream
                .then(stream /*of type MediaStream*/ => {

                    //save the reference of the stream to be able to stop it when necessary
                    audioRecorder.streamBeingCaptured = stream;

                    //create a media recorder instance by passing that stream into the MediaRecorder constructor
                    audioRecorder.mediaRecorder = new MediaRecorder(stream); /*the MediaRecorder interface of the MediaStream Recording
                    API provides functionality to easily record media*/

                    //clear previously saved audio Blobs, if any
                    audioRecorder.audioBlobs = [];

                    //add a dataavailable event listener in order to store the audio data Blobs when recording
                    audioRecorder.mediaRecorder.addEventListener("dataavailable", event => {
                        //store audio Blob object
                        audioRecorder.audioBlobs.push(event.data);
                    });

                    //start the recording by calling the start method on the media recorder
                    audioRecorder.mediaRecorder.start();
                });

            /* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed*/
        }
    },
    /** Stop the started audio recording
     * @returns {Promise} - returns a promise that resolves to the audio as a blob file
     */
    stop: function () {
        //return a promise that would return the blob or URL of the recording
        return new Promise(resolve => {
            //save audio type to pass to set the Blob type
            let mimeType = audioRecorder.mediaRecorder.mimeType;

            //listen to the stop event in order to create & return a single Blob object
            audioRecorder.mediaRecorder.addEventListener("stop", () => {
                //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
                let audioBlob = new Blob(audioRecorder.audioBlobs, { type: mimeType });
                
                //resolve promise with the single audio blob representing the recorded audio
                resolve(audioBlob);
            });
            audioRecorder.cancel();
        });
    },
    /** Cancel audio recording*/
    cancel: function () {
        //stop the recording feature
        audioRecorder.mediaRecorder.stop();

        //stop all the tracks on the active stream in order to stop the stream
        audioRecorder.stopStream();

        //reset API properties for next recording
        audioRecorder.resetRecordingProperties();
    },
    /** Stop all the tracks on the active stream in order to stop the stream and remove
     * the red flashing dot showing in the tab
     */
    stopStream: function () {
        //stopping the capturing request by stopping all the tracks on the active stream
        audioRecorder.streamBeingCaptured.getTracks() //get all tracks from the stream
            .forEach(track /*of type MediaStreamTrack*/ => track.stop()); //stop each one
    },
    /** Reset all the recording properties including the media recorder and stream being captured*/
    resetRecordingProperties: function () {
        audioRecorder.mediaRecorder = null;
        audioRecorder.streamBeingCaptured = null;

        /*No need to remove event listeners attached to mediaRecorder as
        If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
        up by the garbage collector as well as any event handlers/listeners associated with it.
        getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
    }
}
