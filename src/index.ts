import dotenv from 'dotenv';
import fs from 'fs';
import ping from 'ping';

dotenv.config();

const serverIPs = process.env.SERVER_IPS?.split(',') as string[];

const pingInterval = process.env.PING_INTERVAL || 1000;

const logFilePath = process.env.LOG_FILE_PATH || 'ping_logs.txt';

async function pingServers() {
  for (const ip of serverIPs) {
    const result = await ping.promise.probe(ip);

    if (!result.alive) {
      const logMessage = `Server ${ip} not response ${new Date()}\n`;
      console.error(logMessage);

      fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
          console.error(`error write logs: ${err}`);
        }
      });
    }
  }

  setTimeout(pingServers, pingInterval as number);
}

pingServers();
