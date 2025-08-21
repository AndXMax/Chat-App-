const express = require("express");

const { 
    registerUser,
    authUser,
    allUsers 
} = require("../controllers/userController")

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
//"http://localhost:3000/api/user"
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router;