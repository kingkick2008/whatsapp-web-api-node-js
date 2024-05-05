const express = require("express");
const router = new express.Router();
const model = require("../services/WhatsappClient");
const multer = require("multer");
const upload = multer();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/message", upload.single("file"), (req, res) => {
  const file = req.file;
  const clientId = req.body.clientId;
  model.sendMessage(req.body.phoneNumber, req.body.message, clientId, file);
  res.send();
});

// router.get("/:id/start", (req, res) => {
//   model.startClient(req.params.id);
//   res.send();
// });

router.get("/:id/start", async (req, res) => {
  try {
      const clientId = req.params.id;
      // Start the client and get the QR code
      const qrCode = await model.startClient(clientId);
      // Send the QR code as a response
      res.status(200).send(qrCode);
  } catch (error) {
      console.error("Error starting client:", error);
      res.status(500).json({ error: "Internal server error." });
  }
});


router.get("/:id/getContacts", async (req, res) => {
  try {
    const clientId = req.params.id;
    // Ensure the client is connected before fetching contacts
    if (clientId) {
      const contacts = await model.getContacts(clientId);
      res.json(contacts);
    } else {
      res.status(400).json({ error: "WhatsApp client is not connected." });
    }
  } catch (error) {
    console.error("Error getting contacts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/:id/getChats", async (req, res) => {
  try {
    const clientId = req.params.id;
    // Ensure the client is connected before fetching contacts
    if (clientId) {
      const chats = await model.getChats(clientId);
      res.json(chats);
    } else {
      res.status(400).json({ error: "WhatsApp client is not connected." });
    }
  } catch (error) {
    console.error("Error getting contacts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
