// src/Components/ChatListComponent.jsx

import React, { useMemo, useEffect, useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
} from "@mui/material";
import { ChatList } from "./Styles/StyledComponent";
import { useChatContext } from "../Context/ChatContext";
import { sortUsersWithUnread } from "../utils/sortUsersWithUnread";
import axios from "axios";

const URL = "http://localhost:5000"; // Replace with your API URL

const MemoizedChatList = React.memo(
  ({ filteredUsers, loadChat, unreadCount, activeService, title }) => (
    <>
      <h3>{title}</h3>
      <ChatList>
        {filteredUsers.map((chat) => (
          <React.Fragment key={chat.caseId}>
            <ListItem
              button
              onClick={() => loadChat(chat)}
              sx={{
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                },
                padding: "10px 15px",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: "#DFE5E7",
                    color: "#4A4A4A",
                    fontWeight: "bold",
                  }}
                >
                  {chat.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${chat.name} (${chat.caseId})`}
                secondary={chat.lastMessage}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: "bold",
                    color: "#000000",
                  },
                }}
                secondaryTypographyProps={{
                  sx: {
                    color: "#667781",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
              {unreadCount.find((item) => item.phone === chat.phoneNumber)
                ?.unreadCount > 0 && (
                <Badge
                  badgeContent={
                    unreadCount.find((item) => item.phone === chat.phoneNumber)
                      ?.unreadCount
                  }
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: (() => {
                        switch (activeService) {
                          case "sms":
                            return "#1976D2"; // Blue for SMS
                          case "whatsapp":
                            return "#25D366"; // Green for WhatsApp
                          case "mail":
                            return "#DC3545"; // Red for mail
                          default:
                            return "#757575"; // Grey as fallback
                        }
                      })(),
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "50%",
                      minWidth: "24px",
                      height: "24px",
                      fontSize: "0.9rem",
                      padding: "0 6px",
                      marginRight: "10px",
                    },
                  }}
                />
              )}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </ChatList>
    </>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.filteredUsers === nextProps.filteredUsers &&
      prevProps.unreadCount === nextProps.unreadCount
    );
  }
);

const ChatListComponent = ({ userId, refreshChatList }) => {
  const {
    listofUsers,
    loadChat,
    searchTerm,
    unreadCount,
    activeService,
    setSelectedUserPhones,
  } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [unselectedUsers, setUnselectedUsers] = useState([]);

  useEffect(() => {
    const fetchSelectedUsers = async () => {
      try {
        const response = await axios.get(`${URL}/api/user/getSelectedUsers`);
        setSelectedUsers(response.data);
        console.log("Fetched selected users:", response.data);
      } catch (error) {
        console.error("Error fetching selected users:", error);
      }
    };

    fetchSelectedUsers();
  }, [refreshChatList]);

  useEffect(() => {
    const selectedUserPhones = selectedUsers.flatMap((agent) =>
      agent.selectedUsers.map((user) => user.phoneNumber)
    );
    const filteredUnselectedUsers = listofUsers.filter(
      (user) => !selectedUserPhones.includes(user.phoneNumber)
    );
    setUnselectedUsers(filteredUnselectedUsers);
    setSelectedUserPhones(selectedUserPhones); // Pass the phones to ChatContext
    console.log("Filtered unselected users:", filteredUnselectedUsers);
    console.log("Filtered selected users:", selectedUserPhones);
  }, [listofUsers, selectedUsers, setSelectedUserPhones, refreshChatList]);

  const currentAgentSelectedUsers = useMemo(() => {
    const agent = selectedUsers.find((agent) => agent.agentUserId === userId);
    return agent ? agent.selectedUsers : [];
  }, [selectedUsers, userId]);

  const currentAgentSelectedUsersFromList = useMemo(() => {
    return listofUsers.filter((user) =>
      currentAgentSelectedUsers.some(
        (selectedUser) => selectedUser.phoneNumber === user.phoneNumber
      )
    );
  }, [listofUsers, currentAgentSelectedUsers]);

  const filteredSelectedUsers = useMemo(() => {
    return currentAgentSelectedUsersFromList.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentAgentSelectedUsersFromList, searchTerm]);

  const filteredUnselectedUsers = useMemo(() => {
    return unselectedUsers.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [unselectedUsers, searchTerm]);

  return (
    <>
      <MemoizedChatList
        filteredUsers={sortUsersWithUnread(filteredSelectedUsers, unreadCount)}
        loadChat={loadChat}
        unreadCount={unreadCount}
        activeService={activeService}
        title="Selected Users"
      />
      <MemoizedChatList
        filteredUsers={sortUsersWithUnread(
          filteredUnselectedUsers,
          unreadCount
        )}
        loadChat={loadChat}
        unreadCount={unreadCount}
        activeService={activeService}
        title="Unselected Users"
      />
    </>
  );
};

export default ChatListComponent;
