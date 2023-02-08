import { replica, authorKeypair } from "./earthstar.js";

export async function deleteLater(doc) {
    const deletionTime = doc.deleteLater;
    const result = await replica.set(authorKeypair, {
      path: doc.path,
      deleteAfter: deletionTime + 60000 * 1000,
    });
    console.log("new deletion time ", new Date(doc.deleteAfter / 1000));
    console.log("result ", result);
}

export async function deleteSooner(doc) {
    const deletionTime = doc.deleteAfter;
    const result = await replica.set(authorKeypair, {
      path: doc.path,
      deleteAfter: deletionTime - 60000 * 1000,
    });
    console.log("new deletion time ", new Date(doc.deleteAfter / 1000));
    console.log("result ", result);
}