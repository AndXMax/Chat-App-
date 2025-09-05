const express = require("express");
const { listFriends, addFriend } = require("../controllers/friendController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, listFriends);
router.route("/").post(protect, addFriend);

module.exports = router;


