// filepath: [connection.js](http://_vscodecontentref_/0)
require("dotenv").config(); // Load environment variables
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.ATLAS_URI || ""; // Use Atlas URI or fallback to local MongoDB
console.log("MongoDB URI:", uri); // Log the MongoDB URI for debugging
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

async function connectToDatabase() {
    try {

        await client.connect(); // Connect to MongoDB
        await client.db("admin").command({ ping: 1 }); // Ping the database to verify connection
        console.log("Connected to MongoDB");

        // insert one for testing
        db = client.db("chatbot_db"); // Replace "chatbot_db" with your database name
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process if the connection fails
    }
}

function getDatabase() {
    if (!db) {
        throw new Error("Database not initialized. Call connectToDatabase first.");
    }
    return db;
}

module.exports = { connectToDatabase, getDatabase };