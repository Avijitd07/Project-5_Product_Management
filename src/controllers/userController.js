const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { uploadFile } = require('../middleWare/fileUpload');


const createUser = async function (req, res) {
    try {
        let files = req.files
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            var uploadedFileURL = await uploadFile(files[0])
            //res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
           
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
        let body = req.body;
        let { fname, lname, email, phone, address, password } = body;
        

        let profileImage = uploadedFileURL;
        let validUserData = {fname, lname, email, profileImage, phone, address, password}

        validUserData.profileImage = profileImage

        let userdata = await userModel.create(validUserData);
        return res.status(201).send({ status: true, data: userdata });

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message });

    }
}


const getUserProfile = async function(req,res)
{
    try{
        let data = req.query;
        let userId = data._id
        const userDetails = await userModel
        .find({userId })
        .select({address: 1, _id: 1, fname: 1, lname: 1, email: 1, profileImage: 1, phone: 1, password: 1, createdAt: 1, updatedAt: 1})
        
        if(userDetails.length == 0)
        {
            return res.status(404).send({status: false, msg: "No User Found"})
        }

        if(userDetails.length > 0)
        {
            return res.status(200).send({status: true, message: "User Profile Details", data: userDetails})
        }
        else
        {
            return res.status(404).send({status: false, message: "No User Found"})
        }
    }
    catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}


module.exports = { createUser, getUserProfile };