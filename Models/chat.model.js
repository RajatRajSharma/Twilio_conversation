// Models/chat.model.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const agentSchema = new Schema({
  agentUserId: { type: String, default: null },
  agentDisplayName: { type: String, default: null },
  CompanyId: { type: String, default: null },
});

const messageSchema = new Schema({
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  content: { type: String, default: null },
  subject: { type: String, default: null },
  content_type: {
    type: String,
    enum: [
      "text",
      "file",
      "image/jpeg",
      "image/png",
      "video/mp4",
      "audio/mpeg",
      "application/pdf",
    ],
    required: true,
  },
  content_link: { type: String, default: null },
  messageSid: { type: String, default: null },
  accountSid: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false },
  handling_agent: { type: agentSchema, required: true },
});

const conversationSchema = new Schema({
  participant: { type: String, required: true },
  unreadCount: { type: Number, default: 0 },
  unreadSms: { type: Number, default: 0 },
  unreadMails: { type: Number, default: 0 },
  messages: [messageSchema],
  sms: [messageSchema],
  mails: [messageSchema],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
