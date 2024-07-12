const querystring = require('querystring');

module.exports = async function (context, req) {
    context.log('Received a request from Twilio SMS.');

    // Parse URL-encoded form data
    let incomingMessage = querystring.parse(req.body);
    
    context.log('Parsed Message:', incomingMessage);

const numMedia = parseInt(incomingMessage.NumMedia || 0);
    const mediaItems = [];

    for (let i = 0; i < numMedia; i++) {
        mediaItems.push({
            url: incomingMessage[`MediaUrl${i}`],
            contentType: incomingMessage[`MediaContentType${i}`]
        });
    }

    const smsToQueue = JSON.stringify({
        message: incomingMessage.Body,  // Make sure 'Body' is the correct field name
        from: incomingMessage.From,      // Make sure 'From' is the correct field name
		to: incomingMessage.To,
        messageSid: incomingMessage.MessageSid,  // Twilio's unique identifier for the message
        accountSid: incomingMessage.AccountSid,
        timestamp: new Date().toISOString(),
        mediaItems: mediaItems,
        type : "sms"
    });

    context.bindings.outputQueue = smsToQueue;

    // context.res = {
    //     status: 200,
    //     body: {
    //         message: "Message received and processed.",
    //         data: smsToQueue
    //     }
    // };
};
