const app = require("./index");
const { getReceiptData } = require("./helpers/receipt/data");
const { RECEIPT } = require("./helpers/receipt/template");
const { EscPos } = require("@tillpos/xml-escpos-helper");
const Network = require("./network");
const fetch = require("cross-fetch");

const PRINTERS = [
  { device_name: "Essae", host: "192.168.0.8", port: 9100 },
  { device_name: "Epson", host: "192.168.0.9", port: 9100 }];

test();

async function test() {
  // let printer = new app.NetworkPrinter('192.168.0.8');
  // await app.print(printer, 'https://www.google.com');
  // await app.closeBrowser();

  try {
    const template = `<?xml version="1.0" encoding="UTF-8"?>
      <document>
        <align mode="center">
          <image density="d24">        
            {{{orgLogo}}}
          </image> 
        </align>
      </document>
    </xml>
    `;

    let url =
      "https://media-exp1.licdn.com/dms/image/C4E0BAQH2R5X18kykJw/company-logo_200_200/0/1519870249402?e=2159024400&v=beta&t=boI1k_6wI2z8orOQYyYBndxkAsmb1BY5hWJH88YvRno";

    // url ="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"

    // url =
    //   "https://till-x-storage-production.s3.ap-southeast-2.amazonaws.com/images/organizations/logos/red-lion.png?1610467255352";

    //   // Not working
    // url =
    //   "https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/miniondevs-print.png";

    //   url =
    //   "https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/transport-hotel.png";

    //   // Not working
    //   url =  "https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/village-belle-hotel.png"

    //   url="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/wildwater-grill.png"

    //   url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/the-swan.png"

    //   // working but size is huge
    //   url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/the-reddy-pub.png"

    //   // Not working
    //   url = "https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/the-pakenham-hotel.png"

    //   // not printed
    //   url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/the-main-cafe-bar-restaurant-berwick.png"

    //   url = "https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/ball-court-hotel.png"
    
    //   // not printed properly
    //   url = "https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/belgian-beer-cafe.png"
    
    //   // transparent png nothing printed to screen
    //   url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/fal-group-odonoghues.png"

    //   url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/essoign-club.png"

    //   url = "https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/crown-casino.png"

    //   // image size large
    //   url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/coogee-bay-hotel.png"

      // // nothing printed (transparent png white )
      // url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/club-mandalay.png"

      // // nothing printed (not sure but it opened in browser tab)
      // url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/churchills-sports-bar.png"

      // // unrecognoized content at end of stream - pngjs
      // url = "https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/castellos-victorian-tavern.png"

      // // empty printed
      // url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/cardinia-hotel.png"

      // // empty printed
      // url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/campari-house.png"

      // // empty printed
      // url ="https://till-x-storage-staging.s3-ap-southeast-2.amazonaws.com/organizations/bendigo-club.png"
      
      
      // // not working
      // url = "https://p.kindpng.com/picc/s/135-1354048_secret-life-of-pets-rabbit-snowball-secret-life.png"
      // url ="https://cdn3.volusion.com/adgss.rhexw/v/vspfiles/photos/SC1375-2.jpg?v-cache=1562398742"
      const request = await fetch(url);
    const response = await request.arrayBuffer();
    const result =
      "data:" +
      request.headers.get("content-type") +
      ";base64," +
      Buffer.from(response).toString("base64");

    // const buffer = EscPos.getBufferFromTemplate(template, {
    //   orgLogo: result,
    // });

    console.log(response)

    const data = getReceiptData();
    const buffer = EscPos.getBufferFromTemplate(RECEIPT, data);
    await Network.NetworkPrint(buffer, PRINTERS[1]);
    // await Network.DgramPrint(buffer, PRINTERS[0]);
    console.log("receipt was sent to printer!");
  } catch (err) {
    console.log("error", err);
    console.error({
      message: "some error",
      err: JSON.stringify(err, null, 2),
    });
  }
}
