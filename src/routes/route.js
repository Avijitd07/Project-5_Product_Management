const express = require('express');
const controllers = require('../controllers/userController');
const middleware = require("../middleWare/auth")

const router = express.Router(); 

router.post("/register", controllers.createUser)
router.post('/login',controllers.loginUser)
router.get("/user/:userId/profile",middleware.authorization,controllers.getUserProfile)


router.all('/**', (req,res)=>{
    return res.status(404).send({msg:'The requested api is invalid'})

})
module.exports = router;