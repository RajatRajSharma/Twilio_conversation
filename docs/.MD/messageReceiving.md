# Message Receiving Flow

This document provides a detailed explanation of the message receiving process in our chat application, from receiving messages from real applications to displaying them in the UI.

## 1. Send Message from Real Applications
**Participants:** User, Real Applications (WhatsApp, SMS, Email)

Users send messages through real applications such as WhatsApp, SMS, and email.

## 2. Handle Incoming Message by Vendor
**Participants:** Vendor (Twilio for WhatsApp/SMS, SendGrid for Email)

These services handle the incoming messages and forward them to our Function App Service on Azure.

## 3. Forward to Function App Service
**Participants:** Function App Service (MessengingServicesApp)

The messages are forwarded to the appropriate function in our Function App Service.

## 4. Convert to Required Schema
**Files and Functions:** 
- `TwilioMessage` (for WhatsApp)
- `TwilioSMS` (for SMS)
- `TwilioMail` (for Email)

Each function converts the incoming message into our required schema. The schema includes fields like `senderID`, `receiverID`, `type`, `content`, and `media url`. The `type` is equivalent to the `actionService` value.

## 5. Add Message to Queue
**Participant:** whatsappmessage queue

The converted message is added to the appropriate queue based on its type.

## 6. Listen for New Message in Queue
**File and Function:** `queue.service.js`

This service constantly listens for new messages in the queue.

## 7. Add Message to Database
**File and Function:** `queue.service.js`, Azure Cosmos DB

The new message, now in the correct schema, is added to the database. The message is stored based on `type`, `senderID`, and `receiverID` to find the correct conversation.

## 8. Send Message to UI
**File and Function:** `queue.service.js`, `MessageContent.jsx`

After the message is added to the database, it is sent to `MessageContent.jsx` to be displayed in the UI.

## 9. Display Message in Real Time
**File:** `MessageContent.jsx`

This component handles different media attachments and displays the correct message in the correct conversation in real time.

By following this process, we ensure that messages sent from various real applications are correctly received, processed, and displayed in our chat application.
