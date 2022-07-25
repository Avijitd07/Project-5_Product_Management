const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "fname is required"]
    },
    lname: {
        type: String,
        required: [true, "lname is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    profileImage:
    {
        type: String,
        //required: [true, "profileImage is required"]
    }, // s3 link
    phone: {
        type: String,
        required: [true, "phone is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"]
        // minLen: 8, 
        // maxLen: 15
    }, // encrypted password
    address: {
        shipping: {
            street: {
                type: String,
                required: [true, "street is required"]
            },
            city: {
                type: String,
                required: [true, "city is required"]
            },
            pincode: {
                type: Number,
                required: [true, "pincode is required"]
            }
        },
        billing: {
            street: {
                type: String,
                required: [true, "street is required"]
            },
            city: {
                type: String,
                required: [true, "city is required"]
            },
            pincode: {
                type: Number,
                required: [true, "pincode is required"]
            }
        }
    }
}, { timestamps: true }
);

module.exports = mongoose.model("User",userSchema)