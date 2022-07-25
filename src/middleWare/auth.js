const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel")
const mongoose = require("mongoose")

//===================================Authorization===================================================================

const authorization = async function(req,res)
{
    try{
        let token = req.header('x-api-key')
        let userId = req.params._id
        if(!token)
        {
            return res.status(401).send({status: false, msg:"Authentication token is required in header"})
        }
        let decodedToken = jwt.verify(token,"SECRET-OF-GROUP61")
        let findUser = await userModel.findById(userId)
        if(findUser)
        {
            if(decodedToken.userId != findUser.userId)
            {
                return res.status(403).send({status: false, msg: "User is not authorized to access this data"})
            }
        }
        next()
    }
    catch(err){
        res.status(500).send({status: false, msg: err.message})
    }
}


module.exports.authorization = authorization