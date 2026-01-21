import { wss } from './server.js';

export function shutdownAllDevices() {
  const payload = JSON.stringify({ command: 'SHUTDOWN' });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

export function changeFeedSettings(objectDetect) {
  const payload = JSON.stringify({
    command: objectDetect
      ? 'ENABLE_OBJECT_DETECT_FEED'
      : 'DISABLE_OBJECT_DETECT_FEED',
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

export function SendGlobalConfig(data) {
  const payload = JSON.stringify({
    command: 'CONFIG',
    data,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

export function GetGlobalConfig() {
  const payload = JSON.stringify({
    command: 'GET_CONFIG',
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}
export function UpdateGlobalConfig(data) {
  const payload = JSON.stringify({
    command: 'UPDATE_CONFIG',
    data,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

export function sendImages(image) {
  const payload = JSON.stringify({ command: 'CAM_FEED', data: image });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

export function StartFeed() {
  const payload = JSON.stringify({ command: 'START_CAM_FEED' });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

export function StartCalibrate() {
  const payload = JSON.stringify({ command: 'CALIBRATE' });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}


export function sendSensorData(data) {
  const payload = JSON.stringify({ command: 'SENSORS', data: data });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}
