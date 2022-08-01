const { default: mongoose } = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId


const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },
    items: [{
        productId: {
            type: ObjectId,
            required: true,
            ref: "Product"
        },
        quantity:{
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    }
},{ timestamps: true})


module.exports = mongoose.model("Cart", cartSchema)