# Socket Events in Your Chat Project

## Socket Events in `app.js`

1. **Connection Event**
   - **Purpose**: To handle a new user connection.
   - **Functionality**: When a user connects, their `Userid` is checked against the list of connected sockets. If not already connected, they are added to the list.

2. **updateReadcount Event**
   - **Purpose**: To update the read count for messages based on the active service.
   - **Functionality**: The read count for SMS, WhatsApp, or mails is set to zero based on the service specified in the `activeService`.

3. **changeUser Event**
   - **Purpose**: To change the current user in the chat.
   - **Functionality**: When a new user is selected, this event updates the `currentUser`.

4. **NewUsers Event**
   - **Purpose**: To update the list of users.
   - **Functionality**: When the list of users changes, this event updates the `ListofUsers`.

5. **Disconnect Event**
   - **Purpose**: To handle user disconnection.
   - **Functionality**: When a user disconnects, their socket ID is removed from the list of connected sockets.

## Socket Events in `chatcontext.js`

1. **Connection and Authentication**
   - **Purpose**: To establish a socket connection and authenticate using the vendor number.
   - **Functionality**: A socket connection is established, and the vendor number is passed for authentication.

2. **receiveMessage Event**
   - **Purpose**: To handle incoming messages.
   - **Functionality**: When a new message is received, it is added to the list of messages and the chat is scrolled to show the new message.

3. **unreadMessages Event**
   - **Purpose**: To handle unread messages.
   - **Functionality**: This event updates the unread message count for the current service and moves the user with new unread messages to the top of the user list.

4. **changeUser Event**
   - **Purpose**: To change the current user in the chat.
   - **Functionality**: This event updates the current user when a new user is selected.

5. **updateReadcount Event**
   - **Purpose**: To update the read count for the current user.
   - **Functionality**: This event resets the unread message count for the selected user and service.

6. **NewUsers Event**
   - **Purpose**: To update the list of users when a new list is fetched.
   - **Functionality**: This event updates the socket with the new list of users.

7. **Socket Disconnect**
   - **Purpose**: To disconnect the socket connection.
   - **Functionality**: This disconnects the socket connection when the component is unmounted.

## Summary

- **`connection`**: Handles new user connections and adds them to the list of connected sockets.
- **`updateReadcount`**: Updates the read count for messages based on the active service.
- **`changeUser`**: Changes the current user in the chat.
- **`NewUsers`**: Updates the list of users.
- **`disconnect`**: Handles user disconnection and removes the socket ID from the list of connected sockets.
- **`receiveMessage`**: Handles incoming messages and updates the chat.
- **`unreadMessages`**: Handles unread messages and updates the unread message count.

These socket events are integral to the real-time functionality of your chat application, enabling features like live message updates, user switching, and unread message tracking.
