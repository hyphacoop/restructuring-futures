import { replica, authorKeypair } from "./earthstar.js";



async function deleteLater(doc) {
    const deletionTime = doc.deleteLater;
    const result = await replica.set(authorKeypair, {
      path: doc.path,
      deleteAfter: deletionTime + 60000 * 1000,
    });
    console.log("new deletion time ", new Date(doc.deleteAfter / 1000));
    console.log("result ", result);
}

async function deleteSooner(doc) {
    const deletionTime = doc.deleteAfter;
    const result = await replica.set(authorKeypair, {
      path: doc.path,
      deleteAfter: deletionTime - 60000 * 1000,
    });
    console.log("new deletion time ", new Date(doc.deleteAfter / 1000));
    console.log("result ", result);
}

// add time button and function
 export function timeButtons(doc) {
  const timeButton = document.createElement("button");
  timeButton.classList.add("basicBtn", "addtimeBtn");
  timeButton.innerHTML = "+";
  timeButton.addEventListener("click", async => deleteLater(doc));

  // remove time button and function
  const rmtimeButton = document.createElement("button");
  rmtimeButton.classList.add("basicBtn", "rmtimeBtn");
  rmtimeButton.innerHTML = "-";
  rmtimeButton.addEventListener("click", async => deleteSooner(doc));

  // add delete button and function
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteBtn", "basicBtn");
  deleteButton.innerHTML = "X";
  deleteButton.addEventListener("click", async (e) => {
    await replica.wipeDocAtPath(authorKeypair, "/files");
    console.log("deleted");
  });

  // add second delete button and function
  const deleteButton2 = document.createElement("button");
  deleteButton2.classList.add("deleteBtn", "basicBtn");
  deleteButton2.innerHTML = "XX";
  deleteButton2.addEventListener("click", async (e) => {
    await replica.set(authorKeypair, {
      path: "/files",
      text: "",
      attachmentSize: 0,
      attachmentHash: "b4oymiquy7qobjgx36tejs35zeqt24qpemsnzgtfeswmrw6csxbkq",
    });
  });
  // create container
  const btnDiv = document.createElement("div");
  btnDiv.style.marginLeft = "auto";

  // time affects opacity
  const timeUntil = (doc.deleteAfter - Date.now() * 1000) / 60000000;
  console.log("time before deletion", timeUntil.toFixed(2) + "minutes");
  const opacityLevels = timeUntil.toFixed(0) / 60;
  console.log("opacity ", opacityLevels);
  btnDiv.style.backgroundColor = "rgba(51,51,51," + opacityLevels + ")";
  timeButton.style.backgroundColor = "rgba(0,128,0," + opacityLevels + ")";
  rmtimeButton.style.backgroundColor = "rgba(255,255,0," + opacityLevels + ")";
  deleteButton.style.backgroundColor = "rgba(255,0,0," + opacityLevels + ")";
  deleteButton2.style.backgroundColor = "rgba(255,0,0," + opacityLevels + ")";

  if (timeUntil.toFixed(0) < 30) {
    btnDiv.style.color = "black";
  }
  if (opacityLevels < 0.25) {
    timeButton.style.color = "black";
    timeButton.style.borderColor = "black";
  }

  // add buttons to btn container
  btnDiv.appendChild(timeButton);
  btnDiv.appendChild(rmtimeButton);
  btnDiv.appendChild(deleteButton);
  btnDiv.appendChild(deleteButton2);

  return btnDiv;
}
