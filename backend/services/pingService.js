import net from "net";

// para PC → port = 5000
// para PLC → port = 80

export function tcpPing(host, port = 5000, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const start = Date.now();

    socket.setTimeout(timeout);

    socket.connect(port, host, () => {
      const latency = Date.now() - start;

      socket.destroy();

      resolve({
        online: true,
        latency,
      });
    });

    socket.on("error", () => {
      resolve({
        online: false,
        latency: null,
      });
    });

    socket.on("timeout", () => {
      socket.destroy();

      resolve({
        online: false,
        latency: null,
      });
    });
  });
}
