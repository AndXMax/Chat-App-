// filepath: [server.js](http://_vscodecontentref_/1)
require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const friendRoutes = require("./routes/friendRoutes");

console.log("ATLAS_URI:", process.env.ATLAS_URI);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/friends", friendRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);


mongoose.connect(process.env.ATLAS_URI)
.then(() => {
    console.log("Mongoose connected to MongoDB");
    const server = app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
    });

    const io = require("socket.io")(server, {
        pingTimeout: 60000,
        cors: {
            origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
            methods: ["GET", "POST"],
        }
    });

    io.on("connection", (socket) => {
        socket.on("setup", (userData) => {
            socket.join(userData._id);
            socket.emit("connected");
        });

        socket.on("join chat", (room) => {
            socket.join(room);
        });

        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

        socket.on("new message", (newMessageRecieved) => {
            const chat = newMessageRecieved.chat;
            if (!chat.users) return;
            chat.users.forEach((user) => {
                if (user._id == newMessageRecieved.sender._id) return;
                socket.in(user._id).emit("message recieved", newMessageRecieved);
            });
        });

        socket.off("setup", (userData) => {
            socket.leave(userData?._id);
        });
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
