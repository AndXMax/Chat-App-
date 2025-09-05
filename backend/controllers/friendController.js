const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// GET /api/friends
// List current user's friends
const listFriends = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("friends", "name email pic");
    res.json(user?.friends || []);
});

// POST /api/friends
// Body: { friendId }
// Add bidirectional friendship
const addFriend = asyncHandler(async (req, res) => {
    const { friendId } = req.body;
    if (!friendId) {
        res.status(400);
        throw new Error("friendId is required");
    }
    if (String(friendId) === String(req.user._id)) {
        res.status(400);
        throw new Error("Cannot add yourself as a friend");
    }

    const friend = await User.findById(friendId);
    if (!friend) {
        res.status(404);
        throw new Error("Friend not found");
    }

    // Add for requester
    await User.updateOne(
        { _id: req.user._id, friends: { $ne: friendId } },
        { $addToSet: { friends: friendId } }
    );
    // Add for friend (bidirectional)
    await User.updateOne(
        { _id: friendId, friends: { $ne: req.user._id } },
        { $addToSet: { friends: req.user._id } }
    );

    const updated = await User.findById(req.user._id).populate("friends", "name email pic");
    res.status(201).json(updated?.friends || []);
});

module.exports = { listFriends, addFriend };


