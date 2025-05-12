// filepath: [server.js](http://_vscodecontentref_/1)
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const { connectToDatabase, getDatabase } = require("./db/connection");

console.log("ATLAS_URI:", process.env.ATLAS_URI);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

(async () => {
    await connectToDatabase(); // Connect to MongoDB
    const db = getDatabase(); // Get the database instance

    app.get("/", (req, res) => {
        res.send("Hello from the backend!");
    });

    app.post("/log-message", async (req, res) => {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        try {
            const messagesCollection = db.collection("chatbot_db_collection");
            const result = await messagesCollection.insertOne({ message, timestamp: new Date() });
            console.log("Message logged:", result.insertedId);

            res.json({ message: "Message logged successfully", id: result.insertedId });
        } catch (err) {
            console.error("Error logging message:", err);
            res.status(500).json({ error: "Failed to log message" });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})();