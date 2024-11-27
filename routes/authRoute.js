const express = require("express")
const {registerController} = require("../controllers/authController")
const { loginController } = require("../controllers/authController")
const { testController } = require("../controllers/authController");
const { forgotPasswordController } = require("../controllers/authController");

const { requireSignIn } = require("../middlewares/authMiddleware")
const router = express.Router()

// routing
//Register || Post method
router.post("/register", registerController)
// Login || Post method
router.post("/login", loginController)

//forgot password || post method
router.post("/forgot-password", forgotPasswordController)

// test route
router.get("/test", requireSignIn, testController)

// protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ok: true})
})

module.exports = router