// src/components/WhatsAppClone.jsx

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { ChatProvider } from "../Context/ChatContext";
import { useChatContext } from "../Context/ChatContext";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingBar from "react-top-loading-bar";
import {
  Root,
  Sidebar,
  SidebarHeader,
  ChatArea,
  ChatHeader,
  Messages,
} from "./Styles/StyledComponent";
import SearchBarComponent from "./Shared/SearchBarComponent";
import ChatListComponent from "./ChatListComponent";
import MessageList from "./MessageList";
import InputField from "./Shared/InputField";
import ExpandedMediaView from "./Shared/ExpandedMedia";
import MemoizedToolbar from "./Shared/toolbar.jsx";
import { Toolbar, Typography, Avatar, Button } from "@mui/material";
import axios from "axios";

const URL = "http://localhost:5000"; // Replace with your API URL

const socket = io(URL);

const WhatsAppCloneContent = ({ account }) => {
  const {
    handleServiceChange,
    loadMoreMessages,
    currentUser,
    messages,
    expandedMedia,
    hasMore,
    progress,
    activeService,
    handleCloseExpandedMedia,
    selectedUserPhones,
    setSelectedUserPhones,
    sendMessage,
  } = useChatContext();

  const [refreshChatList, setRefreshChatList] = useState(false);

  const toggleRefreshChatList = () => {
    setRefreshChatList((prev) => !prev);
  };

  useEffect(() => {
    socket.on("listUpdated", (data) => {
      console.log("List updated:", data);
      setRefreshChatList((prev) => !prev);
    });

    return () => {
      socket.off("listUpdated");
    };
  }, []);

  const addSelectedUser = () => {
    console.log("Adding selected user:", currentUser);
    console.log("current agent userID :", account.userId);

    const data = {
      agentUserId: account.userId,
      selectedUser: {
        name: currentUser.name,
        emailAddress: currentUser.Email,
        phoneNumber: currentUser.phoneNumber,
      },
    };
    console.log("Data being sent:", data);

    axios
      .post(`${URL}/api/user/addSelectedUser`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("User added successfully");
        toggleRefreshChatList();
      })
      .catch((error) => {
        console.error("Error adding user:", error.response.data);
      });
  };

  const removeSelectedUser = async (req, res) => {
    axios
      .post(`${URL}/api/user/removeSelectedUser`, {
        agentUserId: account.userId,
        selectedUser: {
          phoneNumber: currentUser.phoneNumber,
        },
      })
      .then((response) => {
        console.log("User removed successfully");
        toggleRefreshChatList();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Root>
      <LoadingBar color="#f11946" progress={progress} height={4} />
      <Sidebar>
        <h2>Welcome, {account.displayName}</h2>
        <SidebarHeader position="static">
          <MemoizedToolbar
            handleServiceChange={handleServiceChange}
            activeService={activeService}
          />
        </SidebarHeader>
        <SearchBarComponent />
        <ChatListComponent
          userId={account.userId}
          refreshChatList={refreshChatList}
        />
      </Sidebar>
      <ChatArea>
        {currentUser ? (
          <>
            <ChatHeader position="static">
              <Toolbar>
                <Avatar sx={{ mr: 2 }}>{currentUser.name.charAt(0)}</Avatar>
                <Typography variant="h6">{currentUser.name}</Typography>
                {selectedUserPhones.includes(currentUser.phoneNumber) ? (
                  <Button
                    color="error"
                    onClick={removeSelectedUser}
                    style={{ marginLeft: "auto" }}
                  >
                    Client's Task Done
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={addSelectedUser}
                    style={{ marginLeft: "auto" }}
                  >
                    Select Client
                  </Button>
                )}
              </Toolbar>
            </ChatHeader>
            <Messages
              id="scrollableDiv"
              style={{ display: "flex", flexDirection: "column-reverse" }}
            >
              <InfiniteScroll
                dataLength={messages.length}
                next={loadMoreMessages}
                style={{ display: "flex", flexDirection: "column-reverse" }}
                inverse={true}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>You have seen all messages</b>
                  </p>
                }
                scrollThreshold="500px"
                isReverse={true}
              >
                <MessageList />
              </InfiniteScroll>
            </Messages>
            <InputField activeService={activeService} />
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography variant="h5" color="textSecondary">
              Select a chat to start messaging
            </Typography>
          </div>
        )}
      </ChatArea>
      {expandedMedia && (
        <ExpandedMediaView
          media={expandedMedia}
          onClose={handleCloseExpandedMedia}
        />
      )}
    </Root>
  );
};

export default function WhatsAppClone({ account }) {
  return (
    <ChatProvider account={account}>
      <WhatsAppCloneContent account={account} />
    </ChatProvider>
  );
}
