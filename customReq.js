import express from 'express';
import db from './db.js';
import {
  changeFeedSettings,
  GetGlobalConfig,
  SendGlobalConfig,
  sendImages,
  shutdownAllDevices,
  StartCalibrate,
  StartFeed,
  UpdateGlobalConfig,
} from './wsCommands.js';

const router = express.Router();

router.get('/modules_tasks/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    `select i.iesniegumi_id, concat(s.vards, " ", s.uzvards) as vardsUzvards, m.nosaukums as m_nos, u.uzdevumi_id, tema, u.nosaukums as u_nos, u.punkti as u_punkti, i.punkti as i_punkti, m.moduli_id
    from studenti s
    join moduli_studenti ms on ms.studenti_id = s.studenti_id
    join moduli m on m.moduli_id = ms.moduli_id
    join moduli_uzdevumi mu on mu.moduli_id = m.moduli_id
    join uzdevumi u on u.uzdevumi_id = mu.uzdevumi_id
    left join iesniegumi i on i.uzdevumi_id = u.uzdevumi_id and i.moduli_id = m.moduli_id
    where ms.studenti_id = ?`,
    id,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        const transformedArr = result.reduce((res, el) => {
          const existingItem = res.find((i) => i.m_nos == el.m_nos);

          const taskPoints = el.u_punkti;
          const gottenPoints = el.i_punkti;

          const moduleName = el.m_nos;
          delete el.m_nos;

          const moduleID = el.moduli_id;
          delete el.moduli_id;

          const fullName = el.vardsUzvards;
          delete el.vardsUzvards;

          if (existingItem) {
            existingItem.p_kopa += el.u_punkti;
            existingItem.i_kopa += el.i_punkti;
            existingItem.uzdevumi.push(el);
          } else
            res.push({
              moduli_id: moduleID,
              m_nos: moduleName,
              p_kopa: taskPoints,
              i_kopa: gottenPoints,
              vardsUzvards: fullName,
              uzdevumi: [{ ...el }],
            });

          return res;
        }, []);

        res.send(transformedArr);
      }
    },
  );
});

router.delete('/removeTask/:id/:taskId', (req, res) => {
  const id = req.params.id;
  const taskId = req.params.taskId;
  db.query(
    `DELETE FROM moduli_uzdevumi WHERE uzdevumi_id = ? and moduli_id = ?`,
    [taskId, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.send(result);
      }
    },
  );
});

router.get('/comments/:subID', (req, res) => {
  const subID = req.params.subID;

  db.query(
    `select concat(vards, ' ', uzvards) as sutitajs, komentars, ir_students, k.datums as k_datums
    from komentari k
    join iesniegumi i on i.iesniegumi_id = k.iesniegumi_id
    join studenti s on s.studenti_id = i.studenti_id
    where k.iesniegumi_id = ?
    order by k_datums`,
    subID,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.send(result);
      }
    },
  );
});

router.post('/studentModules', async (req, res) => {
  const keys = Object.keys(req.body).toString();
  const values = Object.values(req.body);

  db.query(
    `select studenti_id from moduli_studenti where studenti_id = ? and moduli_id = ?`,
    [req.body.studenti_id, req.body.moduli_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
      } else {
        if (result.length == 0) {
          db.query(
            `INSERT INTO moduli_studenti (${keys}) VALUES (?)`,
            [values],
            (err, result) => {
              if (err) {
                res.status(500).json({ message: err.message });
                console.log(err);
              } else {
                res.json({ message: 'Added entry' });
              }
            },
          );
        }
      }
    },
  );
});

router.post('/sensorData', async (req, res) => {
  const { temperatura, apgaismojums, attalums, timestamp } = req.body;

  if (
    !Array.isArray(temperatura) ||
    !Array.isArray(apgaismojums) ||
    !Array.isArray(attalums) ||
    !Array.isArray(timestamp)
  ) {
    return res.status(400).json({ message: 'Invalid payload format' });
  }

  const length = temperatura.length;

  if (
    apgaismojums.length !== length ||
    attalums.length !== length ||
    timestamp.length !== length
  ) {
    return res.status(400).json({ message: 'Array lengths do not match' });
  }

  if (length === 0) {
    return res.status(400).json({ message: 'No sensor data provided' });
  }

  const rows = [];
  for (let i = 0; i < length; i++) {
    rows.push([temperatura[i], apgaismojums[i], attalums[i], timestamp[i]]);
  }

  const sql = `
    INSERT INTO Sensori
    (temperatura, apgaismojums, attalums, datums)
    VALUES ?
  `;

  db.query(sql, [rows], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: err.message });
    }

    res.json({
      message: 'Sensor data inserted',
      rowsInserted: result.affectedRows,
    });
  });
});

router.post('/shutdown', (req, res) => {
  shutdownAllDevices();
  res.json({ ok: true, message: 'Shutdown signal sent' });
});

router.post('/changeCameraFeed', (req, res) => {
  if (typeof req.body?.objectDetect === 'boolean') {
    changeFeedSettings(req.body.objectDetect);
    res.status(200).json({ ok: true, message: 'Sent change request' });
  } else
    res
      .status(400)
      .json({ ok: true, message: 'objectDetect param is not provided' });
});

router.post('/camera_feed', (req, res) => {
  sendImages();
  res.status(200).json({ ok: true, message: 'Sent change request' });
});

router.post('/start_camera_feed', (req, res) => {
  StartFeed();
  res.status(200).json({ ok: true, message: 'Sent change request' });
});

router.post('/globalConfig', (req, res) => {
  SendGlobalConfig(req.body);
  res.status(200).json({ ok: true, message: 'Sent config' });
});

router.post('/GET_CONFIG', (req, res) => {
  GetGlobalConfig();
  res.status(200).json({ ok: true, message: 'Sent config request' });
});

router.put('/CONFIG', (req, res) => {
  StartCalibrate();
  res.status(200).json({ ok: true, message: 'Sent calibrate request' });
});

router.put('/calibrate', (req, res) => {

  res.status(200).json({ ok: true, message: 'Sent update config request' });
});

router.get('/SensorData', (req, res) => {
  db.query(
    `SELECT *
FROM Sensori
WHERE datums >= NOW() - INTERVAL 1 DAY limit 500;
`,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(200).send(result);
      }
    },
  );
});

router.get('/NewEvents', (req, res) => {
  db.query(
    `SELECT *
FROM Notikumi
order by datums
limit 4;`,
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(200).send(result);
      }
    },
  );
});

export default router;
