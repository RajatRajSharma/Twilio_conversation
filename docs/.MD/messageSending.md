# Message Sending Flow with Hybrid Encryption

This document provides a detailed explanation of the message sending process in our chat application, including encryption steps, function names, and file interactions.

## 1. Select Active Service
**File:** `ChatContext.jsx`
**Function:** `handleServiceChange`

The user selects the active service (default is WhatsApp, other options include SMS and email). This value is used throughout the message sending process to determine which service to use.

## 2. Write Message
**File:** `InputField.jsx`

The user writes the message they want to send.

## 3. Select File
**File:** `ChatContext.jsx`
**Function:** `handleFileSelect`

The user selects a file locally, which is then uploaded to Azure Storage.

## 4. Upload File to Azure Storage
**File:** `ChatContext.jsx`
**Function:** `uploadToBlob`

The selected file is uploaded to an Azure Storage container. The function returns the URL of the uploaded file.

## 5. Combine Message and File URL
**File:** `ChatContext.jsx`

The message from step 2 and the file URL from step 4 are combined into a JSON object with the correct schema.

## 6. Send Message to Server
**File:** `ChatContext.jsx`
**Function:** `sendMessage`

The JSON object is sent to the server.

## 7. Handle Message on Server
**File:** `user.controller.js`
**Function:** `sendMessage`

The server receives the JSON object and gets the `activeService` value. Based on this value, it calls the appropriate function to send the message.

## 8. Send Message via Twilio
**File:** `twilio.service.js`
**Functions:** `sendWhatsAppMessage`, `sendSMSMessage`, `sendEmailMessage`

The server formats the message according to the selected service (WhatsApp, SMS, or email) and sends it using Twilio services.

## 9. Save Message to Database
**File:** `user.controller.js`

After sending the message, server finds correct conversation in database , then there based on actionService it selectes correct array [] , then adds the message to it . By doing this it adds message to the Azure Cosmos DB database.

## 10. Update UI
**File:** `ChatContext.jsx`

The UI is updated to show the sent message.
