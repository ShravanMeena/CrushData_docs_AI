const express = require("express");
const { createChat, saveMessage, getChats, getChatMessagesById, deleteChat } = require("../controllers/chatController");
const router = express.Router();

// No need to call verifyToken again here; already applied globally!
router.post("/create", createChat);
router.post("/sendMessage", saveMessage);
router.get("/getChats", getChats);
router.get("/getChats/:chatId", getChatMessagesById);
router.delete("/:chatId", deleteChat);

module.exports = router;