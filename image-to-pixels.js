var pngjs = require("pngjs");
var ndarray = require("ndarray");
const fetch = require("cross-fetch");

const PNG = pngjs.PNG;

const main = async () => {
  const url =
    "https://p.kindpng.com/picc/s/135-1354048_secret-life-of-pets-rabbit-snowball-secret-life.png";
  const request = await fetch(url);
  const response = await request.arrayBuffer();
  const result =
    "data:" +
    request.headers.get("content-type") +
    ";base64," +
    Buffer.from(response).toString("base64");

  const img_data = PNG.sync.read(result);

  const pixels = ndarray(
    new Uint8Array(img_data.data),
    [img_data.width | 0, img_data.height | 0, 4],
    [4, (4 * img_data.width) | 0, 1],
    0
  );

  // fs.writeFileSync("out.json", JSON.stringify(pixels));
  console.log("pixels", pixels);
};

main();
