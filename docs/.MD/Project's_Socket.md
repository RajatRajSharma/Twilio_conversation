# Socket Events in Your Chat Project

## Socket Events in `app.js`

1. **Connection Event**
   - **Purpose**: To handle a new user connection.
   - **Functionality**: When a user connects, their `Userid` is checked against the list of connected sockets. If not already connected, they are added to the list.
   - ```
     io.on("connection", (socket) => {
  const Userid = socket.handshake.auth.userid;
  if (!connectedSockets.find((soc) => soc.Userid === Userid)) {
    console.log("A user connected", Userid);
    connectedSockets.push({
      socketId: socket.id,
      Userid,
    });
  }
});
     ```

2. **updateReadcount Event**
   - **Purpose**: To update the read count for messages based on the active service.
   - **Functionality**: The read count for SMS, WhatsApp, or mails is set to zero based on the service specified in the `activeService`.
   - ```
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
     ```

3. **changeUser Event**
   - **Purpose**: To change the current user in the chat.
   - **Functionality**: When a new user is selected, this event updates the `currentUser`.
   - ```
     socket.on("changeUser", ({ chat }) => {
  console.log(`User came : ${chat}`);
  currentUser = chat;
});
     ```

4. **NewUsers Event**
   - **Purpose**: To update the list of users.
   - **Functionality**: When the list of users changes, this event updates the `ListofUsers`.
   - ```
     socket.on("NewUsers", (list) => {
  ListofUsers = list;
});
     ```

5. **Disconnect Event**
   - **Purpose**: To handle user disconnection.
   - **Functionality**: When a user disconnects, their socket ID is removed from the list of connected sockets.
   - ```
     socket.on("disconnect", () => {
  connectedSockets = connectedSockets.filter(
    (soc) => soc.socketId !== socket.id
  );
  console.log("A user disconnected");
});

     ```

## Socket Events in `chatcontext.js`

1. **Connection and Authentication**
   - **Purpose**: To establish a socket connection and authenticate using the vendor number.
   - **Functionality**: A socket connection is established, and the vendor number is passed for authentication.
   - ```
     const socket = io(URL, {
  auth: {
    userid: vendorNumber,
  },
});
socketRef.current = socket;
     ```

2. **receiveMessage Event**
   - **Purpose**: To handle incoming messages.
   - **Functionality**: When a new message is received, it is added to the list of messages and the chat is scrolled to show the new message.
   - ```
     socket.on("receiveMessage", (newMessage) => {
  console.log("message received");
  setMessages((prevMessages) => [newMessage, ...prevMessages]);
  scrollToNewMessage();
});
     ```

3. **unreadMessages Event**
   - **Purpose**: To handle unread messages.
   - **Functionality**: This event updates the unread message count for the current service and moves the user with new unread messages to the top of the user list.
   - ```
     socket.on("unreadMessages", ({ newMessage, unreadmsg, ListofUsers }) => {
  let phone = null;
  console.log("unreadMessage came!!", unreadmsg);
  if (activeService === "mail") {
    console.log(ListofUsers);
    let data = ListofUsers.find(
      (user) => user.Email === newMessage.sender_id
    );
    console.log("DATA : ", data);
    phone = data.phoneNumber;
  }
  setUnreadcount((prevUnreadCount) => {
    const updatedUnreadCount = prevUnreadCount.map((item) => {
      if (
        item.phone ===
        (activeService === "mail" ? phone : newMessage.sender_id)
      ) {
        return { ...item, unreadCount: unreadmsg };
      }
      return item;
    });
    if (
      !updatedUnreadCount.some(
        (item) =>
          item.phone ===
          (activeService === "mail" ? phone : newMessage.sender_id)
      )
    ) {
      updatedUnreadCount.push({
        phone: activeService === "mail" ? phone : newMessage.sender_id,
        unreadCount: unreadmsg,
      });
    }
    console.log(updatedUnreadCount);
    return updatedUnreadCount;
  });

  // Move the user with new unread messages to the top
  setListofusers((prevUsers) => {
    const userIndex = prevUsers.findIndex(
      (user) => user.phoneNumber === newMessage.sender_id
    );
    if (userIndex > -1) {
      const [user] = prevUsers.splice(userIndex, 1);
      return [user, ...prevUsers];
    }
    return prevUsers;
  });
});
     ```

4. **changeUser Event**
   - **Purpose**: To change the current user in the chat.
   - **Functionality**: This event updates the current user when a new user is selected.
   - ```
     socketRef.current.emit("changeUser", { chat });
     ```

5. **updateReadcount Event**
   - **Purpose**: To update the read count for the current user.
   - **Functionality**: This event resets the unread message count for the selected user and service.
   -  ```
      socketRef.current.emit("updateReadcount", {
  count: chat.phoneNumber,
  activeService,
});
     ```

6. **NewUsers Event**
   - **Purpose**: To update the list of users when a new list is fetched.
   - **Functionality**: This event updates the socket with the new list of users.
   -  ```
      socketRef.current.emit("NewUsers", response.data);
     ```

7. **Socket Disconnect**
   - **Purpose**: To disconnect the socket connection.
   - **Functionality**: This disconnects the socket connection when the component is unmounted.
   -  ```
      return () => {
  socket.disconnect();
};
     ```

## Summary

- **`connection`**: Handles new user connections and adds them to the list of connected sockets.
- **`updateReadcount`**: Updates the read count for messages based on the active service.
- **`changeUser`**: Changes the current user in the chat.
- **`NewUsers`**: Updates the list of users.
- **`disconnect`**: Handles user disconnection and removes the socket ID from the list of connected sockets.
- **`receiveMessage`**: Handles incoming messages and updates the chat.
- **`unreadMessages`**: Handles unread messages and updates the unread message count.

These socket events are integral to the real-time functionality of your chat application, enabling features like live message updates, user switching, and unread message tracking.
