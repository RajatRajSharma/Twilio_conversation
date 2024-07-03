# ChatApp Setup and Run Instructions
## Combined commands

  >npm run install:all

  >npm run dev

- These commands should be run in home directory for combine installation and running of both frontend and server .

## Prerequisites

### node_module installation

  >npm i

  >whatsappClone>npm i

### Run app

  >node app.js

  >whatsappClone>npm run dev

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/chatApp
ACCOUNT_SID=ACd84fdd63ecd8510a8135ebfb58f5427b
ACCOUNT_AUTH=
BUS_CONNECTION_URI=Endpoint=
QUEUE_NAME=whatsappmessage
AZURE_STORAGE_ACCOUNT_NAME=twilioappstorage
AZURE_STORAGE_ACCOUNT_KEY=
AZURE_STORAGE_CONTAINER_NAME=azure-twilio-media
SENDGRID_API_KEY=
```
