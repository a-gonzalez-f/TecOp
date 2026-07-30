import ModbusRTU from "modbus-serial";

export async function readHoldingRegisters({
  ip,
  port,
  slaveId = 1,
  start,
  length,
}) {
  const client = new ModbusRTU();

  try {
    await client.connectTCP(ip, {
      port: Number(port),
    });

    client.setID(Number(slaveId));

    const { data } = await client.readHoldingRegisters(start, length);

    return data;
  } finally {
    if (client.isOpen) {
      await client.close();
    }
  }
}
