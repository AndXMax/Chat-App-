// filepath: [server.js](http://_vscodecontentref_/1)
require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectToDatabase, getDatabase } = require("./db/connection");
const chats = require("./data/data"); 
const userRoutes = require("./routes/userRoutes");

console.log("ATLAS_URI:", process.env.ATLAS_URI);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api/user", userRoutes); // User routes


mongoose.connect(process.env.ATLAS_URI)
.then(() => {
    console.log("Mongoose connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
    });
})
.catch((err) => {
    console.error("Mongoose connection error:", err);
    process.exit(1);
});

// (async () => {
//     debugger; // Enable debugging mode
//     await connectToDatabase(); // Connect to MongoDB
//     const db = getDatabase(); // Get the database instance

//     app.get("/", (req, res) => {
//         res.send("Hello from the backend!");
//     });

//     app.listen(PORT, () => {
//         console.log(`Server is running on http://localhost:${PORT}`);
//     });
// })();
