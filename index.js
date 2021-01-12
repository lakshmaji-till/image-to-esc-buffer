const puppeteer = require("puppeteer");
const getPixels = require("get-pixels");
var Jimp = require("jimp");
var ndarray = require("ndarray");
var request = require("request");
var fetch = require("node-fetch");
var parseDataURI = require("parse-data-uri");
var UPNGJS = require("upng-js");
var PNG = require("pngjs").PNG;

// noinspection JSUnresolvedVariable
/**
 * using 'require('escpos').Printer'
 * because Webstorm is having trouble resolving fields from exports that's a function.
 */
const escpos = require("escpos").Printer;

escpos.Network = require("escpos-network");
escpos.Serial = require("escpos-serialport");
escpos.USB = require("escpos-usb");

/**
 * @type {Browser}
 */
let browser;

/**
 * Start the puppeteer browser
 */
async function launchBrowser() {
  if (!browser) {
    console.log("Launching Headless Chrome");
    if (process.platform === "linux") {
      browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox"],
      });
    } else {
      browser = await puppeteer.launch();
    }
    console.log("Headless Chrome Launched");
  }
}

/**
 * close and dispose the browser instance
 */
async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

/**
 *
 * @param {Printer} printer
 * @param {string} url - the page you wanted to print.
 * @param {string|null} [selector] - optional, the DOM element you wanted to print.
 * @param {string|null} [waitForFunction] - An evaluation (Ex: document.readyState === 'complete'), the program will wait until it became true
 * @param {Object} [options]
 * @param {boolean} [options.cut = true] - true if the printer should cut paper at the end
 * @param {number} [options.topFeed = 2] - number of lines to feed before printing
 * @param {number} [options.bottomFeed = 2] - number of lines to feed after printing
 * @return {Promise<Error|undefined>}
 */
async function print(printer, url, selector, waitForFunction, options) {
  //initialize the browser if it isn't initialized
  // await launchBrowser();

  let page = undefined;

  try {
    // page = await browser.newPage();

    // let width = printer.options.width;
    // if(!width) {
    //     width = 575;
    // }

    // // noinspection JSObjectNullOrUndefined
    // await page.setViewport({width: width, height: 600});

    // await page.goto(url);
    // if(waitForFunction) {
    //     await page.waitForFunction(waitForFunction);
    // }

    // let screen = await screenshotDOMElement({
    //     page: page,
    //     selector: selector?selector:'body'
    // });

    printer.printImageFromUrl(options);
  } catch (e) {
    console.error(e.stack);
    return e;
  } finally {
    if (page) {
      page.close();
    }
  }
}

/**
 * Takes a screenshot of a DOM element on the page, with optional padding.
 */
async function screenshotDOMElement(opts = {}) {
  let padding = "padding" in opts ? opts.padding : 0;
  let path = "path" in opts ? opts.path : null;
  let selector = opts.selector;
  let page = opts.page;

  if (!selector) throw Error("Please provide a selector.");

  const rect = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const { x, y, width, height } = element.getBoundingClientRect();
    return { left: x, top: y, width, height, id: element.id };
  }, selector);

  if (!rect)
    throw Error(`Could not find element that matches selector: ${selector}.`);

  // noinspection JSCheckFunctionSignatures
  await page.setViewport({
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  });

  return await page.screenshot({
    path,
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    },
  });
}

class Printer {
  adapter;
  printer;
  options;

  /**
   * @param adapter - defines how you connect the printer to the local machine
   * @param {Object} options
   * @param {number} options.width - the printer's printable area width, in pixels, default is 575
   */
  constructor(adapter, options = {}) {
    this.adapter = adapter;
    this.options = options;

    this.printer = new escpos.Printer(adapter, options);
  }

  /**
   * @param {Buffer|string} image The image to be printed, can be either a buffer of pixels or an url to the image file.
   * @param {Object} [options]
   * @param {boolean} [options.cut = true] - true if the printer should cut paper at the end
   * @param {number} [options.topFeed = 2] - number of lines to feed before printing
   * @param {number} [options.bottomFeed = 2] - number of lines to feed after printing
   */
  printImage(image, options = {}) {
    getPixels(image, "image/png", (err, pixels) => {
      if (err) {
        console.error(err);
      } else {
        try {
          this.adapter.open((err) => {
            if (err) {
              console.error(err);
            } else {
              if (options.topFeed === undefined) {
                options.topFeed = 2;
              }
              if (options.topFeed) {
                this.printer.feed(options.topFeed);
              }

              this.printer.align("ct").raster(new escpos.Image(pixels), null);

              if (options.bottomFeed === undefined) {
                options.bottomFeed = 2;
              }
              if (options.bottomFeed) {
                this.printer.feed(options.bottomFeed);
              }

              if (options.cut === undefined) {
                options.cut = true;
              }
              if (options.cut) {
                this.printer.cut();
              }

              this.printer.close();
            }
          });
        } catch (e) {
          console.error(e.stack);
        }
      }
    });
  }

  /**
   * @param {Buffer|string} image The image to be printed, can be either a buffer of pixels or an url to the image file.
   * @param {Object} [options]
   * @param {boolean} [options.cut = true] - true if the printer should cut paper at the end
   * @param {number} [options.topFeed = 2] - number of lines to feed before printing
   * @param {number} [options.bottomFeed = 2] - number of lines to feed after printing
   */
  async printImageFromUrl(options = {}) {
    const response = await fetch("https://8f2eb453aee9.ngrok.io/getbitmap");
    const res = await response.json();

    const buffer = parseDataURI(res.imgData);

    // buffer.mimeType, buffer.data
    // const img_data = UPNGJS.decode(buffer.data);
    // const pixels = ndarray(
    //   img_data.data,
    //   [img_data.width | 0, img_data.height | 0, 4],
    //   [4, (4 * img_data.width) | 0, 1],
    //   0
    // );

    // console.log(img_data);
    // // return
    // try {
    //   this.adapter.open((err) => {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       this.printer.align("ct").raster(new escpos.Image(pixels), null);
    //       this.printer.text(
    //         "**************************************************"
    //       );
    //       this.printer.feed(5);

    //       // this.printer.close();
    //     }
    //   });
    // } catch (e) {
    //   console.error(e.stack);
    // }

    var png = new PNG();
    png.parse(buffer.data, (err, img_data) => {
      if (err) {
        cb(err);
        return;
      }
      const pixels = ndarray(
        new Uint8Array(img_data.data),
        [img_data.width | 0, img_data.height | 0, 4],
        [4, (4 * img_data.width) | 0, 1],
        0
      );

      try {
        this.adapter.open((err) => {
          if (err) {
            console.error(err);
          } else {
            this.printer.align("ct").raster(new escpos.Image(pixels), null);

            this.printer.feed(2);

            this.printer.cut();
            this.printer.close();
          }
        });
      } catch (e) {
        console.error(e.stack);
      }
    });

    const url =
      "https://media-exp1.licdn.com/dms/image/C4E0BAQH2R5X18kykJw/company-logo_200_200/0/1519870249402?e=2159024400&v=beta&t=boI1k_6wI2z8orOQYyYBndxkAsmb1BY5hWJH88YvRno";
    // var type;
    // var cb;
    // fetch(url)
    // .then(response => {
    //     if(response.headers.get !== undefined) {

    //       type = response.headers.get('content-type');
    //     }
    //     return response.arrayBuffer()

    //   }).then((buffer => {

    //     console.log('bello fetch body',b )
    //   doParse(type, buffer, cb);

    // })).catch(err => {
    //   console.log('err', err)
    // })

    // Jimp.read(
    //   // "https://media-exp1.licdn.com/dms/image/C4E0BAQH2R5X18kykJw/company-logo_200_200/0/1519870249402?e=2159024400&v=beta&t=boI1k_6wI2z8orOQYyYBndxkAsmb1BY5hWJH88YvRno",
    //   bufferData,
    //   (err, img) => {
    //     if (err) throw err;

    //     // img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
    //     const img_data = {
    //       width: img.bitmap.width,
    //       height: img.bitmap.height,
    //       data: img.bitmap.data,
    //     };
    //     const ndArrRef = ndarray(
    //       new Uint8Array(img_data.data),
    //       [img_data.width | 0, img_data.height | 0, 4],
    //       [4, (4 * img_data.width) | 0, 1],
    //       0
    //     );

    //     // console.log(ndArrRef)
    //     try {
    //       this.adapter.open((err) => {
    //         if (err) {
    //           console.error(err);
    //         } else {
    //           this.printer.align("ct").raster(new escpos.Image(ndArrRef), null);

    //           this.printer.feed(2);

    //           this.printer.close();
    //         }
    //       });
    //     } catch (e) {
    //       console.error(e.stack);
    //     }
    //     // });
    //   }
    // );

    // Implementation #
    // getPixels("till.png", (err, pixels) =>{
    // getPixels(res.imgData, (err, pixels) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     try {
    //       this.adapter.open((err) => {
    //         if (err) {
    //           console.error(err);
    //         } else {
    //           if (options.topFeed === undefined) {
    //             options.topFeed = 2;
    //           }
    //           if (options.topFeed) {
    //             this.printer.feed(options.topFeed);
    //           }

    //           this.printer.align("ct").raster(new escpos.Image(pixels), null);

    //           if (options.bottomFeed === undefined) {
    //             options.bottomFeed = 2;
    //           }
    //           if (options.bottomFeed) {
    //             this.printer.feed(options.bottomFeed);
    //           }

    //           if (options.cut === undefined) {
    //             options.cut = true;
    //           }
    //           if (options.cut) {
    //             this.printer.cut();
    //           }

    //           this.printer.close();
    //         }
    //       });
    //     } catch (e) {
    //       console.error(e.stack);
    //     }
    //   }
    // });
  }
}

class NetworkPrinter extends Printer {
  constructor(ip, port, options = {}) {
    super(new escpos.Network(ip, port), options);
  }
}

class USBPrinter extends Printer {
  constructor(vid, pid, options = {}) {
    // noinspection JSValidateTypes
    super(new escpos.USB(vid, pid), options);
  }
}

class SerialPrinter extends Printer {
  constructor(port, portConfig, options = {}) {
    super(new escpos.Serial(port, portConfig), options);
  }
}

module.exports.launchBrowser = launchBrowser;
module.exports.closeBrowser = closeBrowser;
module.exports.print = print;

module.exports.Printer = Printer;
module.exports.NetworkPrinter = NetworkPrinter;
module.exports.USBPrinter = USBPrinter;
module.exports.SerialPrinter = SerialPrinter;
