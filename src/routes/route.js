const express = require('express');
const controllers = require('../controllers/userController');
const middleware = require("../middleWare/auth")

const router = express.Router(); 

router.post("/register", controllers.createUser)
router.get("/user/:userId/profile",/*middleware.authorization,*/controllers.getUserProfile)
//const { createUser, loginUser }= require('../controllers/userController');



//router.post("/register", createUser)
//router.post('/login',loginUser)

module.exports = router;