import * as Earthstar from "https://deno.land/x/earthstar@v10.2.2/mod.ts";

const SHARE_TO_SYNC =
        "+chatroom.bghrat2j2szeym5ql7egdppduxjhytfoqsryfa4axea7y4gnphvsq";

const SHARE_SECRET = "bbicfwgfwtrldnnezqfw2o5h4vajzj6uvqkhnuinmtryrnqi4gofq";

const authorKeypair = await Earthstar.Crypto.generateAuthorKeypair("suzy");

if (Earthstar.isErr(authorKeypair)) {
        console.error(authorKeypair);
        Deno.exit(1);
}

const replica = new Earthstar.Replica({
        driver: new Earthstar.ReplicaDriverMemory(SHARE_TO_SYNC),
        shareSecret: SHARE_SECRET,
});

await replica.set(authorKeypair, {
        path: "/chat",
        text: "Hello world.",
});

const peer = new Earthstar.Peer();

peer.addReplica(replica);

// replace with your own server address
const syncer = peer.sync(Deno.args[0]);

await syncer.isDone();

console.log("Successfully synced with server.");
