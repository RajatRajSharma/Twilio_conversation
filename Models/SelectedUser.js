// api/models/SelectedUser.js

import mongoose from "mongoose";

const SelectedUserSchema = new mongoose.Schema({
  agentUserId: { type: Number, required: true }, // UserID of the agent (same as userID)
  CompanyId: { type: Number, required: true },
  agentDisplayName: { type: String, required: true },
  selectedUsers: [
    {
      name: { type: String, required: true }, // Name of the selected user/client
      emailAddress: { type: String, required: true }, // Email address of the selected user/client
      phoneNumber: { type: String, required: true }, // Phone number of the selected user/client
    },
  ],
});

const SelectedUser = mongoose.model("SelectedUser", SelectedUserSchema);

export default SelectedUser;
