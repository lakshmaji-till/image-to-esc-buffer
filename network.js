const net = require("net");

NetworkPrint = (buffer, { port, host }) => {
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

// module.exports = Network;
module.exports = { NetworkPrint };
