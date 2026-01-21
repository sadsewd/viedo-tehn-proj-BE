import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import http from 'http';
import { WebSocketServer } from 'ws';
import { sendImages, sendSensorData } from './wsCommands.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  console.log('Device connected via WebSocket');

  ws.on('message', (message) => {
    const msgObject = JSON.parse(message.toString());
    if (msgObject?.type == 'camera' && msgObject?.frame)
      sendImages(msgObject.frame);
    if (msgObject?.type == 'CURR_SENSOR') {
      console.log('Message received:', msgObject);

      sendSensorData({
        temperatura: msgObject.temperatura,
        apgaismojums: msgObject.apgaismojums,
        attalums: msgObject.attalums,
      });
    }
  });

  ws.on('close', () => {
    console.log('Device disconnected');
  });

  ws.send(JSON.stringify({ status: 'CONNECTED' }));
});

server.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});

export { wss };
