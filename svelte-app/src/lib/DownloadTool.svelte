<script>
    import replica from "../store/replica";
    import authorKeypair from "../store/identity";
    import cache from "../store/cache";

    import JSZip from 'jszip'
    
    let documents = [];
    let paths = [];
    let archive = [];

    const fetchDocs = async () => {
        documents = $cache.cache.queryDocs({
            filter: {
                pathStartsWith: "/documents",
            }
        });

        // Extract paths from documents and store in paths array
        paths = documents.map(doc => doc.path);
    }

    const fetchAttachments = async (zip) => {
        for(let doc of documents) {
            let folder = zip.folder(doc.path.replace("/", "_")); // Replace / with _ in the path to create a valid folder name
            folder.file("document.txt", JSON.stringify(doc)); // Add document content to a text file in the folder

            if (doc.attachmentSize) { // If the doc has an attachment
                let attachment = await $replica.replica.getAttachment(doc);
                let attachmentBytes = attachment ? await attachment.bytes() : undefined;

                // Extract filename from doc.path
                let filename = doc.path.split("/").pop().replace("!", "");

                // Add the attachment to a file in the folder
                // TODO: may need to convert attachmentBytes to a Blob or other appropriate format depending on the format of the attachment
                folder.file(filename, attachmentBytes);
            }
        }
    }

    const downloadArchive = async (zip) => {
        let content = await zip.generateAsync({type:"blob"});
        let element = document.createElement("a");
        let date = new Date().toISOString().slice(0,10); // Get the current date in YYYY-MM-DD format
        element.href = URL.createObjectURL(content);
        element.download = "archive_" + date + ".zip";
        element.style.display = "none";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const createArchive = async () => {
        let zip = new JSZip();
        await fetchDocs();
        await fetchAttachments(zip);
        await downloadArchive(zip);
    }




/*  old function before jszip

    const fetchAttachments = async () => {
        for(let doc of documents) {
            if (doc.attachmentSize) { // If the doc has an attachment
                let attachment = await $replica.replica.getAttachment(doc);
                let attachmentBytes = attachment ? await attachment.bytes() : undefined;
                doc.attachmentBytes = attachmentBytes;
            }
            archive.push(JSON.stringify(doc)); // Add each doc (with its attachment if it exists) to the archive
        }
    }

    const downloadArchive = () => {
        let element = document.createElement("a");
        let file = new Blob([archive.join("\n")], {type: "text/plain"}); // Each document is on a new line
        element.href = URL.createObjectURL(file);
        element.download = "archive.txt";
        element.style.display = "none";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const createArchive = async () => {
        await fetchDocs();
        await fetchAttachments();
        downloadArchive();
    } */
</script>

<button on:click={createArchive}>Create Archive</button>