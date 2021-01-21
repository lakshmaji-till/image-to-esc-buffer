const app = require("./index");
const { getReceiptData } = require("./helpers/receipt/data");
const { RECEIPT } = require("./helpers/receipt/template");
const { EscPos } = require("@tillpos/xml-escpos-helper");
const Network = require("./network");

const PRINTERS = [{ device_name: "Essae", host: "192.168.0.8", port: 9100 }];

test();

async function test() {
  // let printer = new app.NetworkPrinter('192.168.0.8');
  // await app.print(printer, 'https://www.google.com');
  // await app.closeBrowser();

  try {
    const data = getReceiptData();
    const buffer = EscPos.getBufferFromTemplate(RECEIPT, data);
    await Network.NetworkPrint(buffer, PRINTERS[0]);
    console.log("receipt was sent to printer!");
  } catch (err) {
      console.log('error', err)
    console.error({
      message: "some error",
      err: JSON.stringify(err, null, 2),
    });
  }
}
