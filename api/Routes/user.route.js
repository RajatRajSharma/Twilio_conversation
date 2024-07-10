// user.routes.js

import express from "express";
import {
  listofUsers,
  sendMessage,
  getChatbyNumber,
  getUnreadcount,
  generateSasurl,
} from "../Controllers/user.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/user/listofUsers:
 *   get:
 *     summary: Get list of users
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/listofUsers", listofUsers);

/**
 * @swagger
 * /api/user/sendMessage:
 *   post:
 *     summary: Send a message to Twilio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               to:
 *                 type: string
 *     responses:
 *       200:
 *         description: A successful response
 */
router.post("/sendMessage", sendMessage);

/**
 * @swagger
 * /api/user/getchatbyNumber:
 *   post:
 *     summary: Get previous messages by number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *     responses:
 *       200:
 *         description: A successful response
 */
router.post("/getchatbyNumber", getChatbyNumber);

/**
 * @swagger
 * /api/user/getUnreadcount:
 *   get:
 *     summary: Get unread message count
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/getUnreadcount", getUnreadcount);

/**
 * @swagger
 * /api/user/getSasurl:
 *   get:
 *     summary: Get a unique blob URL
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/getSasurl", generateSasurl);

export default router;

// import express from 'express';
// import { listofUsers, sendMessage, getChatbyNumber, getUnreadcount, generateSasurl } from '../Controllers/user.controller.js';

// const router = express.Router();

// // Give the list of users
// router.get('/listofUsers', listofUsers);
// // Going to send a message to twilio
// router.post('/sendMessage', sendMessage);
// // Going to send previous messages as response
// router.post('/getchatbyNumber', getChatbyNumber);
// // Going to get message Unread Count
// router.get('/getUnreadcount', getUnreadcount);
// // Going to get a unique blob url
// router.get('/getSasurl', generateSasurl);
// export default router;
