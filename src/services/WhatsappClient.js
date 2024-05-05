const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { MessageMedia } = require("whatsapp-web.js");
const clients = {};
const qrcode2 = require("qrcode");
module.exports = class ServiceModule {


  static startClient(id) {
    return new Promise((resolve, reject) => {
        // Check if the client already exists
        if (clients[id]) {
            // Check if the client is already ready
            if (clients[id].isReady()) {
                // Client is already ready, return a message
                resolve("Client is already ready!");
                return;
            }
            // Client exists but not ready, just attach event listeners
            attachEventListeners(clients[id], resolve, reject);
            return;
        }

        // Create a new client instance
        clients[id] = new Client({
            authStrategy: new LocalAuth({
                clientId: id,
            }),
            webVersionCache: {
                type: "remote",
                remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2407.3.html`,
            },
        });

        // Attach event listeners
        attachEventListeners(clients[id], resolve, reject);

        // Initialize the client
        clients[id].initialize().catch(reject);
    });
    function attachEventListeners(client, resolve, reject) {
        // Listen for the QR event
        client.on("qr", (qr) => {
            qrcode.generate(qr, { small: true });
            qrcode2.toDataURL(qr, (err, url) => {
                if (err) {
                    reject(err);
                } else {
                    // Send the QR code data URL as the response
                    resolve(url);
                }
            });
        });
    
        // Listen for the ready event
        client.on("ready", () => {
            console.log("Client is ready!");
            // Resolve with a message indicating the client is ready
            resolve("Client is ready!");
        });
    
        // Listen for errors
        client.on("error", (error) => {
            // Reject with the error
            reject(error);
        });
    }
}



  static sendMessage(phoneNumber, message, clientId, file) {
    if (file) {
      const messageFile = new MessageMedia(
        file.mimetype,
        file.buffer.toString("base64")
      );
      clients[Number(clientId)].sendMessage(phoneNumber, messageFile);
    } else {
      clients[clientId].sendMessage(phoneNumber, message);
    }
  }

  static async getContacts(id) {
    try {
      const client = clients[id];
      console.log(client);
      if (!client) {
        throw new Error("WhatsApp client is not connected.");
      }

      const contacts = await client.getContacts();
      return contacts;
    } catch (error) {
      console.error("Error getting contacts:", error);
      throw error;
    }
  }

  static async getChats(id) {
    try {
      const client = clients[id];
      console.log(client);
      if (!client) {
        throw new Error("WhatsApp client is not connected.");
      }

      const contacts = await client.getChats();
      return contacts;
    } catch (error) {
      console.error("Error getting contacts:", error);
      throw error;
    }
  }
};
