// api/Routes/user.routes.js

import express from "express";
import {
  listofUsers,
  sendMessage,
  getChatbyNumber,
  getUnreadcount,
  generateSasurl,
  addSelectedUser,
  removeSelectedUser,
  getSelectedUsers,
} from "../Controllers/user.controller.js";

const router = express.Router();

router.post("/addSelectedUser", addSelectedUser);
/**
 * @swagger
 * /api/user/addSelectedUser:
 *   post:
 *     summary: Add a selected user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agentUserId
 *               - selectedUser
 *             properties:
 *               agentUserId:
 *                 type: integer
 *                 example: 45518
 *               selectedUser:
 *                 type: object
 *                 required:
 *                   - name
 *                   - emailAddress
 *                   - phoneNumber
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   emailAddress:
 *                     type: string
 *                     example: johndoe@example.com
 *                   phoneNumber:
 *                     type: string
 *                     example: 918851144028
 *     responses:
 *       200:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User added successfully
 *                 agent:
 *                   $ref: '#/components/schemas/Agent'
 *       500:
 *         description: Error adding user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error adding user
 *                 error:
 *                   type: object
 */

router.post("/removeSelectedUser", removeSelectedUser);
/**
 * @swagger
 * /api/user/removeSelectedUser:
 *   post:
 *     summary: Remove a selected user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agentUserId
 *               - selectedUser
 *             properties:
 *               agentUserId:
 *                 type: integer
 *                 example: 45518
 *               selectedUser:
 *                 type: object
 *                 required:
 *                   - phoneNumber
 *                 properties:
 *                   phoneNumber:
 *                     type: string
 *                     example: 918851144028
 *     responses:
 *       200:
 *         description: User removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User removed successfully
 *                 agent:
 *                   $ref: '#/components/schemas/Agent'
 *       500:
 *         description: Error removing user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error removing user
 *                 error:
 *                   type: object
 */

router.get("/getSelectedUsers", getSelectedUsers);
/**
 * @swagger
 * /api/user/getSelectedUsers:
 *   get:
 *     summary: Get selected users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of selected users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       500:
 *         description: Error fetching selected users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching selected users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         emailAddress:
 *           type: string
 *         phoneNumber:
 *           type: string
 *     Message:
 *       type: object
 *       required:
 *         - sender_id
 *         - receiver_id
 *         - content_type
 *       properties:
 *         sender_id:
 *           type: string
 *         receiver_id:
 *           type: string
 *         content:
 *           type: string
 *           nullable: true
 *         subject:
 *           type: string
 *           nullable: true
 *         content_type:
 *           type: string
 *           enum: [text, file, image/jpeg, image/png, video/mp4, audio/mpeg, application/pdf]
 *         content_link:
 *           type: string
 *           nullable: true
 *         messageSid:
 *           type: string
 *           nullable: true
 *         accountSid:
 *           type: string
 *           nullable: true
 *         timestamp:
 *           type: string
 *           format: date-time
 *         is_read:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and messaging operations
 */

/**
 * @swagger
 * /api/user/listofUsers:
 *   get:
 *     summary: Get list of users
 *     tags : [User]
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/listofUsers", listofUsers);

/**
 * @swagger
 * /api/user/sendMessage:
 *   post:
 *     summary: Send a message
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - type
 *               - phone
 *             properties:
 *               message:
 *                 $ref: '#/components/schemas/Message'
 *               type:
 *                 type: string
 *                 description: Active service type
 *               phone:
 *                 type: string
 *                 description: Phone number of the current user
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/sendMessage", sendMessage);

/**
 * @swagger
 * /api/user/getchatbyNumber:
 *   post:
 *     summary: Get previous messages by number or email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - page
 *               - limit
 *               - type
 *             properties:
 *               number:
 *                 type: string
 *                 description: Phone number or email of the user
 *               page:
 *                 type: integer
 *                 description: Page number for pagination
 *               limit:
 *                 type: integer
 *                 description: Number of messages per page
 *               type:
 *                 type: string
 *                 description: Type of service (e.g., 'mail' or 'sms')
 *     responses:
 *       200:
 *         description: Successfully retrieved chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       400:
 *         description: Bad request
 *       404:
 *         description: No messages found
 *       500:
 *         description: Internal server error
 */
router.post("/getchatbyNumber", getChatbyNumber);

/**
 * @swagger
 * /api/user/getUnreadcount:
 *   get:
 *     summary: Get unread message count
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: service
 *         schema:
 *           type: string
 *         required: false
 *         description: The service type for which to get the unread message count
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get("/getUnreadcount", getUnreadcount);

/**
 * @swagger
 * /api/user/getSasurl:
 *   get:
 *     summary: Get a unique blob URL
 *     tags : [User]
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/getSasurl", generateSasurl);

export default router;
