// app.js

import express from "express";
import cors from "cors";
import connectDB from "./Config/databaseConnection.js";
import userRoute from "./api/Routes/user.route.js";
import { Server } from "socket.io";
import http from "http";
import { queueService } from "./Services/queue.service.js";
import Conversation from "./Models/chat.model.js";
import dotenv from "dotenv";
import getPhoneNumber from "./utils/emailService.js";
import AIroute from "./api/Routes/GPT.route.js";
import setupSwagger from "./swaggerConfig.js";
import SelectedUser from "./Models/SelectedUser.js";

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup Swagger
setupSwagger(app);

// Routes
app.use("/api/user", userRoute);
app.use("/api/AI", AIroute);

// Create HTTP server and initialize Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as necessary for your CORS policy
    methods: ["GET", "POST"],
  },
});

let connectedSockets = [];
let currentUser = null;
let ListofUsers = [];

io.on("connection", (socket) => {
  const Userid = socket.handshake.auth.userid;
  if (!connectedSockets.find((soc) => soc.Userid === Userid)) {
    console.log("A user connected", Userid);
    connectedSockets.push({
      socketId: socket.id,
      Userid,
    });
  }
  // Handle socket events here
  socket.on("updateReadcount", async ({ count, activeService }) => {
    const data = await Conversation.findOne({ participant: count });
    if (data) {
      if (activeService === "sms") {
        data.unreadSms = 0;
      } else if (activeService === "whatsapp") {
        data.unreadCount = 0;
      } else {
        data.unreadMails = 0;
      }
      await data.save();
    }
  });
  socket.on("changeUser", ({ chat }) => {
    console.log(`User came : ${chat}`);
    currentUser = chat;
  });
  socket.on("NewUsers", (list) => {
    ListofUsers = list;
  });
  socket.on("updateList", async (data) => {
    io.emit("listUpdated", data);
  });
  socket.on("disconnect", () => {
    connectedSockets = connectedSockets.filter(
      (soc) => soc.socketId !== socket.id
    );
    console.log("A user disconnected");
  });
});

// Export the io instance if needed in other modules
export { io };

queueService.addMessageHandler(async (messageData) => {
  console.log("Processing message:", messageData);
  let from, to, phone;

  // For New service modify the sender and receiver here.
  if (messageData.type === "sms") {
    from = messageData.from.slice(1);
    to = messageData.to.slice(1);
  } else if (messageData.type === "whatsapp") {
    from = messageData.from.slice(10);
    to = messageData.to.slice(10);
  } else {
    from = messageData.from;
    to = messageData.to;
    phone = getPhoneNumber(from, ListofUsers);
  }

  let unreadmsg = null;

  // Making a new conversation if the sender is new..
  try {
    let data = await Conversation.findOne({
      participant: messageData.type === "mail" ? phone : from,
    });

    if (!data) {
      data = new Conversation({
        participant: messageData.type === "mail" ? phone : from,
        messages: [],
        sms: [],
        mails: [],
        unreadCount: 0,
        unreadSms: 0,
        unreadMails: 0,
      });
      console.log("New conversation created on receiver side...");
    }

    // Add your message processing logic here
    let timestamp = new Date(messageData.timestamp);
    const mongodbTimestamp = timestamp.toISOString().replace("Z", "+00:00");

    let contentType = "text";
    let contentLink = null;

    // Handle media items here..
    if (messageData.mediaItems && messageData.mediaItems.length > 0) {
      contentType = messageData.mediaItems[0].contentType;
      contentLink = messageData.mediaItems[0].url;
    }

    // Find agent details from SelectedUser collection if the message type is 'mail'
    let handling_agent = {
      agentUserId: "",
      agentDisplayName: "",
      CompanyId: "",
    };

    const selectedUser = await SelectedUser.findOne({
      "selectedUsers.phoneNumber": from,
    });

    if (selectedUser) {
      const selectedUserInfo = selectedUser.selectedUsers.find(
        (user) => user.phoneNumber === from
      );

      if (selectedUserInfo) {
        handling_agent.agentUserId = selectedUser.agentUserId;
        handling_agent.agentDisplayName = selectedUser.agentDisplayName;
        handling_agent.CompanyId = selectedUser.CompanyId;
      }
    }

    const newMessage = {
      sender_id: from,
      receiver_id: to,
      content: messageData.message,
      messageSid: messageData.messageSid,
      accountSid: messageData.accountSid || null,
      content_type: contentType,
      content_link: contentLink,
      timestamp: mongodbTimestamp,
      is_read: false,
      subject: messageData.subject,
      handling_agent: handling_agent,
    };

    console.log("newMessage to be saved : ", newMessage);

    // Handle unreadMessage logic here...
    if (messageData.type === "sms") {
      if (currentUser !== null && currentUser.phoneNumber !== from) {
        data.unreadSms += 1;
      }
      if (currentUser === null) {
        data.unreadSms += 1;
      }
    } else if (messageData.type === "whatsapp") {
      if (currentUser !== null && currentUser.phoneNumber !== from) {
        data.unreadCount += 1;
      }
      if (currentUser === null) {
        data.unreadCount += 1;
      }
    } else {
      // For mails
      if (currentUser !== null && currentUser.Email !== from) {
        data.unreadMails += 1;
      }
      if (currentUser === null) {
        data.unreadMails += 1;
      }
    }

    unreadmsg =
      messageData.type === "sms"
        ? data.unreadSms
        : messageData.type === "whatsapp"
        ? data.unreadCount
        : data.unreadMails;

    // Save data according to the message type here..
    if (messageData.type === "sms") {
      data.sms.push(newMessage);
    } else if (messageData.type === "whatsapp") {
      data.messages.push(newMessage);
    } else {
      // For mails
      data.mails.push(newMessage);
    }

    await data.save();
    console.log("Message successfully saved on receiver side.");
    console.log(
      "Processed message in our message model:",
      JSON.stringify(newMessage, null, 2)
    );

    // Handle the socket logic for different services here ..
    const SOCKET = connectedSockets.find((soc) => soc.Userid === to);
    if (!SOCKET) {
      return;
    }

    if (
      messageData.type === "mail" &&
      currentUser !== null &&
      from === currentUser.Email
    ) {
      io.to(SOCKET.socketId).emit("receiveMessage", newMessage);
    } else if (currentUser !== null && from === currentUser.phoneNumber) {
      io.to(SOCKET.socketId).emit("receiveMessage", newMessage);
    }

    io.to(SOCKET.socketId).emit("unreadMessages", {
      newMessage,
      unreadmsg,
      ListofUsers,
    });
  } catch (error) {
    console.log("Error in storing message on receiver side:", error.message);
  }
});

// Start listening for messages when the app starts
queueService.startListening().catch(console.error);

// Graceful shutdown
process.on("SIGINT", async () => {
  await queueService.stopListening();
  process.exit(0);
});

// Start the server
const PORT = process.env.WEBSITES_PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
