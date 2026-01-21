import express from 'express';
import requests from './requests.js';
import customReq from './customReq.js';

const router = express.Router();

router.use('/custom', customReq);
router.use('/Atteli', requests);
router.use('/Sensori', requests);
router.use('/Notikumi', requests);

export default router;
