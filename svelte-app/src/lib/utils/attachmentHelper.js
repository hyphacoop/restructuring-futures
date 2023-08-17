export async function getAttachment(doc, replica) {
    let filetype, attachmentBytes, mimetype;
    const attachment = await replica.getAttachment(doc);
    let fileExtension = doc.path.split('.').pop();

    if (attachment !== undefined) {
        console.log('fileExtension', fileExtension);
        const docdata = await attachment.bytes();
        console.log("docdata", docdata);

        let bytes = new Uint8Array(docdata.length);
        for (var i = 0; i < docdata.length; i++) {
            bytes[i] = docdata[i];
        }
        switch (fileExtension) {
            case "md":
                filetype = "markdown";
                var decoder = new TextDecoder("utf-8");
                attachmentBytes = decoder.decode(new Uint8Array(docdata));
                break;
            case "mp3":
            case "ogg":
            case "webm":
                filetype = "audio";
                mimetype = "audio/" + fileExtension;
                console.log("this is audio");
                console.log(filetype, mimetype);
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: mimetype })
                );
                break;
            case "txt":
                filetype = "text";
                console.log(filetype);
                //attachmentBytes = String.fromCharCode(...bytes);
                var decoder = new TextDecoder("utf-8");
                attachmentBytes = decoder.decode(Uint8Array.from(bytes));
                break;
            case "png":
            case "jpeg":
            case "jpg":
            case "gif":
                filetype = "image";
                console.log("this is an image");
                console.log("fileExtension " + fileExtension);
                mimetype = "image/" + fileExtension;
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: mimetype })
                );
                break;
            case "pdf":
                filetype = "pdf";
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: "application/pdf" })
                );
                break;
            default:
                filetype = "other";
                console.log(filetype);
                attachmentBytes = URL.createObjectURL(
                    new Blob([bytes], { type: "application/octet-stream" })
                );
            }
            console.log('filetype in helper function:', filetype)
            console.log('bytes',    attachmentBytes)
        return attachmentBytes;
    }
}

export function getFileExt(doc) {
    let fileExtension = doc.path.split('.').pop();
    let filetype;
    switch (fileExtension) {
        case "md":
            filetype = "markdown";
            break;
        case "mp3":
        case "ogg":
        case "webm":
            filetype = "audio";
            break;
        case "txt":
            filetype = "text";
            break;
        case "png":
        case "jpeg":
        case "jpg":
        case "gif":
            filetype = "image";

            break;
        case "pdf":
            filetype = "pdf";
            break;
        default:
            filetype = "other";
            console.log(filetype);
            break;
        }
        console.log('filetype in fileExt function:', filetype)
    return filetype;
}

export function extractDateFromPath(path) {
    // Regular expression to match a sequence of numbers
    const regex = /(\d{13})/;

    const match = path.match(regex);
    if (!match) {
        throw new Error('No timestamp found in the path');
    }

    const timestamp = parseInt(match[1], 10);
    const date = new Date(timestamp);

    // Format the date in the desired format: Aug 14 2023 10:04:45 GMT+0000
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const time = date.toTimeString().split(' ')[0];

    const gmtOffset = date.getTimezoneOffset() > 0 ? 
                     '-'+Math.abs(date.getTimezoneOffset()/60) : 
                     '+'+Math.abs(date.getTimezoneOffset()/60);
    const gmtString = `GMT${gmtOffset.padStart(5,'0')}00`;

    return `${month} ${day} ${year}`;
}