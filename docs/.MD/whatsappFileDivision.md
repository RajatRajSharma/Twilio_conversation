# WhatsApp Clone Project

## File Structure
```json
whatsappClone
|- src
|- Context
|     |- ChatContext.jsx
|- Components
      |- ChatListComponent.jsx
      |- MessageContent.jsx
      |- MessageList.jsx
      |- WhatsappClone.jsx
      |- LegacyContent
      |     |- Legacy_whatsapp.jsx
      |- Styles
      |     |- StyledComponent.jsx
      |- Shared
      |- ExpandedMedia.jsx
      |- InputField.jsx
      |- SearchBarComponent.jsx
      |- toolbar.jsx
```json


## File Explanations

### Context

- **ChatContext.jsx**
  - Contains the main logic for the chat functionality, including:
    - Initialization of socket and references to `socketRef`.
    - Socket listeners like `receiveMessage` to update messages when new messages are received and `unreadMessages` to get the count of unread messages.
    - Functions for media handling: `handleMediaClick` to expand media and `handleCloseExpandedMedia` to close the expanded media.
    - `uploadToBlob` to upload selected media to Azure Storage and get the URL of the stored media.
    - `handleFileSelect` to select a media file from local storage.
    - `loadChat` to load chat when a user is clicked.
    - `loadMoreMessages` for lazy loading more messages upon scrolling.
    - `sendMessage` to send a message to the server containing the message, media link, and `actionService` value.
    - `handleServiceChange` to change the `actionService` value between SMS, WhatsApp, and email.

### Components

- **ChatListComponent.jsx**
  - UI for the list of users, including their avatars, names, and the count of unread messages for different `actionService` values.

- **MessageContent.jsx**
  - Displays different message formats based on the selected `actionService`.
  - Handles different types of media files sent with messages as attachments.
  - Different formats for SMS, WhatsApp, and email, including subject and body for email.

- **MessageList.jsx**
  - Depends on `MessageContent.jsx` to get the message format along with media.
  - Adds the time of sending and correctly presents messages in the UI under `MessageBubble`.

- **WhatsappClone.jsx**
  - Contains UI code to represent the entire messaging section.
  - Includes infinite scrolling to load older messages (20 at a time).
  - Differentiates between sent and received messages.
  - Displays the name of the person being chatted with in the navbar of the messaging section.

- **LegacyContent**
  - **Legacy_whatsapp.jsx**
    - The old code used earlier, left unchanged as it was a combined complex code and later divided into smaller parts.

- **Styles**
  - **StyledComponent.jsx**
    - Contains styles for different frontend functions.

- **Shared**
  - **ExpandedMedia.jsx**
    - UI code for displaying an enlarged view of media files when clicked in the chat.

  - **InputField.jsx**
    - Input field for the message, button to select a file from local storage, and a send button.
    - For `activeService = sms`: Only message input and send button (Twilio SMS doesn't support sending media).
    - For `activeService = whatsapp`: Message input, media selection button, and send button.
    - For `activeService = mail`: Input for subject, input for body/message, media attachment button, and send button.

  - **SearchBarComponent.jsx**
    - Used to search for a user from the large list of users.

  - **toolbar.jsx**
    - UI for the button on the user list navbar to select the `activeService` value, with the default value being WhatsApp.
