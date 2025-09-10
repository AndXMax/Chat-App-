const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient({
  keyFilename: './nlp_key/secret_key.json',
});
// Get all Messages
// GET /api/message/:chatId
// Protected
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat"); 
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Create New Message
// POST /api/message
// Protected
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.sendStatus(400);
    }

    const newMessage = {
        sender: req.user._id,
        content,
        chat: chatId
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const analyzeSentiment = asyncHandler(async (req, res) => {
    console.log("Analyze Sentiment called");
    const messageId = req.params.messageId;

    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Perform sentiment analysis
        const document = {
            content: message.content,
            type: 'PLAIN_TEXT',
        };
        try {
        const [result] = await client.analyzeSentiment({ document });
        const sentimentScore = result.documentSentiment.score;
        const sentimentMagnitude = result.documentSentiment.magnitude;
        console.log(`Sentiment Score: ${sentimentScore}, Magnitude: ${sentimentMagnitude}`);

        // Update message with sentiment analysis results
        message.sentimentScore = sentimentScore;
        message.sentimentMagnitude = sentimentMagnitude;
        await message.save();
        console.log("Message updated with sentiment analysis");
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
        }


        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
    console.log("Analyze Sentiment completed");
});

module.exports = { allMessages, sendMessage, analyzeSentiment };


