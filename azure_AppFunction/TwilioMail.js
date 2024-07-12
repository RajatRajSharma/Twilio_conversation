const querystring = require('querystring');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

const uploadToAzureBlobStorage = async (filename, content, context) => {
    context.log("Content length in blob storage: ", content.length);
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage);
    const containerClient = blobServiceClient.getContainerClient('azure-twilio-media');
    const blobName = `${uuidv4()}-${filename}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // Convert binary string to Buffer
    const buffer = Buffer.from(content, 'binary');
    
    // Upload the buffer
    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: "image/jpeg" }
    });
    
    context.log(`Uploaded blob with name ${blobName} and size ${buffer.length} bytes`);
    return blockBlobClient.url || "Error";
};

module.exports = async function (context, req) {
    try {
        context.log('Received a request from SendGrid Inbound Parse.');
        context.log('Raw request body:', req.rawBody);
        const contentType = req.headers['content-type'] || 'No Content-Type header found';
        context.log('Content-Type:', contentType);
        const requestBody = req.body.toString('binary');
        context.log("Request Original: ", requestBody);
        const boundary = contentType.split('boundary=')[1];
        const parts = requestBody.split('--' + boundary);
        let emailData = {};
        let mediaItems = [];

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i].trim();
            if (!part) continue;

            const match = part.match(/name="([^"]+)"(?:;\s*filename="([^"]+)")?\r\n(?:Content-Type:\s*([^\r\n]+)\r\n)?(?:Content-Transfer-Encoding:\s*([^\r\n]+)\r\n)?\r\n([\s\S]+)/i);
            if (match) {
                const [, name, filename, contentType, encoding, content] = match;
                if (filename) {
                    context.log("Attachment found:", { name, filename, contentType, encoding });
                    context.log("Content length:", content.length);
                    try {
                        const blobUrl = await uploadToAzureBlobStorage(filename, content , context);
                        mediaItems.push({
                            name: name,
                            filename: filename,
                            contentType: contentType,
                            url: blobUrl
                        });
                    } catch (error) {
                        context.log('Error uploading attachment:', error);
                    }
                } else {
                    emailData[name] = content.trim();
                }
            }
        }

        // Extract fields directly from emailData
        const text = emailData.text || '';
        const html = emailData.html || '';
        const fromMatch = emailData.from.match(/<([^>]+)>/);
        const from = fromMatch ? fromMatch[1] : emailData.from;
        const to = emailData.to || '';
        const subject = emailData.subject || '';

        // Extract Message-ID from headers
        let messageSid = '';
        if (emailData.headers) {
            const messageIdMatch = emailData.headers.match(/Message-ID:\s*<([^>]+)>/i);
            if (messageIdMatch) {
                messageSid = messageIdMatch[1];
            }
        }

        const emailToQueue = JSON.stringify({
            message: text,
            html: html,
            from: from,
            to: to,
            subject: subject,
            messageSid: messageSid,
            timestamp: new Date().toISOString(),
            mediaItems: mediaItems,
            type: "mail"
        });

        context.log('Processing message:', emailToQueue);
        context.bindings.outputQueue = emailToQueue;
    }
    catch(err) {
        context.log('Error', err);
    }
    context.res = {
        status: 200,
        body: "Email received and processed."
    };
};
