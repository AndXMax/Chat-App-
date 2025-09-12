require("dotenv").config(); // Load environment variables
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.ATLAS_URI || "";
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

        db = client.db("chatapp");
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