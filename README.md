## How to test ChatGPT routes:

#### GET http://localhost:5000/api/AI/getSummary?convoID=917666374530
- This will get you Summary of whole chat . the chat can be choosed based on "convoID" that is "participant" = "917666374530" in database .
- ex- {
  "Response": "User1, an intern at Transition Computing, introduced himself as Rajat Raj Sharma, a 4th year student at PVG COET college, providing his email address, phone number, and IFSC number. User2 expressed excitement to work together on the Twilio WhatsApp project with ChatGPT integration."
}

#### GET http://localhost:5000/api/AI/getRelevantInfo?convoID=917666374530
- This will get you all the special info provided during the conversation we had based on "convoID" that is "participant" = "917666374530" in database .
- ex- {
  "Response": "- **User1 Information:**\n  - Name: Rajat Raj Sharma\n  - Email: sharmarajatraj1@gmail.com\n  - Phone number: 7666374530\n  - IFSC number: 98765432110\n\n- **Project Details:**\n  - Project Name: Twilio_whatsapp on ChatGPT integration"
}

#### GET http://localhost:5000/api/AI/generateResponse?convoID=917666374530
###### JSON : {
######  "question": "Can you provide a summary of today's meeting?"
###### }

# ChatApp Setup and Run Instructions
### node_module installation

  > npm i

  > cd whatsappClone
  > whatsappClone> npm i

### Run app

  >node run dev

  > cd whatsappClone
  >whatsappClone> npm run dev

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
OPENAI_KEY=
```
