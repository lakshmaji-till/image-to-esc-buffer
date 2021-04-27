const net = require("net");
const dgram = require("dgram");

NetworkPrint = async (buffer, { port, host }) => {
  return new Promise((res, rej) => {
    let device = new net.Socket();

    device.on("close", () => {
      if (device) {
        device.destroy();
        device = null;
      }
      res();
      return;
    });

    device.on("error", rej);

    device.connect(port, host, () => {
      device.write(buffer);
      device.emit("close");
    });
  });
};

DgramPrint = async (buffer, { port, host }) => {
  return new Promise((res, rej) => {
    const client = dgram.createSocket("udp4");
    console.log(`host, port:`, host, port);

    client.connect(9100, host, (err) => {

      console.log(`connect error:err `,err);
      client.send(buffer, (err2) => {
        console.log(`send error:err2`,err2);

        if(!err2) {
          // client.close();
          res();
        }
      });
    });



    // client.on("message", (msg, info) => {
    //   console.log("Data received from server : " + msg.toString());
    //   console.log(
    //     "Received %d bytes from %s:%d\n",
    //     msg.length,
    //     info.address,
    //     info.port
    //   );
    // });

    // //sending msg
    // client.send(buffer, 9100, "192.168.0.8", (error) => {
    //   if (error) {
    //     console.log(error);
    //     client.close();
    //   } else {
    //     console.log("Data sent !!!");
    //     res();
    //   }
    // });

    client.on("error", (err) => {
      console.log(`server error:\n${err}`);
      client.close();
    });

  });
};

// module.exports = Network;
module.exports = { NetworkPrint, DgramPrint };
