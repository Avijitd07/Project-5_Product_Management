const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

//===================================Authorization===================================================================

const authorization = async function (req, res, next) {
    try {
        let token = req.headers["authorization"]
        if (!token) return res.status(401).send({ status: false, msg: "Authentication token is required in header" })

        let bearertoken = token.split(' ')
        let realToken = bearertoken[1]
        let userId = req.params.userId
        if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: 'invalid ObjectId' })
        if (!token) {
            return res.status(401).send({ status: false, msg: "Authentication token is required in header" })
        }
        let decodedToken = jwt.verify(realToken, "GroupNo-61",

            function (err) {
                if (err) {
                    return res.status(401).send({ status: false, msg: "invalid token" })
                }
            })

        if (decodedToken.id !== userId) return res.status(403).send({ status: false, msg: "User is not authorized to access this data" })
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.authorization = authorization