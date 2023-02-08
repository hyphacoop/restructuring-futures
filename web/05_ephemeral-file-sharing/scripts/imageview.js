export function renderImage(docdata) {


  let bytes = new Uint8Array(docdata.length);

  for (var i = 0; i < docdata.length; i++) {
    bytes[i] = docdata[i];
  }
  console.log("bytes ", bytes);
  let blob = new Blob([bytes])
  console.log("blob ", blob);
  const image = document.createElement("img");
  image.className = "image_view";
  console.log("image ", image);
  const a = document.createElement("a");
  const imageData = URL.createObjectURL(new Blob([bytes], { type: "image/png" }));
  a.href = imageData;
  a.download = "image.png";
  a.innerHTML = "Download Image";
  a.appendChild(image);
  image.src = imageData;



  return a;
}