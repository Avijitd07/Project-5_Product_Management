const productModel = require('../models/productModel')
const { uploadFile } = require('../middleWare/fileUpload')
const objectId = require('mongoose').Types.ObjectId


const isValid = function (x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;

    return true;
};
const isValidBody = function (x) {
    return Object.keys(x).length > 0;
};

const isValidImage = function (x) {
    let regEx = /.+\.(?:(jpg|gif|png|jpeg))/;
    let result = regEx.test(x);
    return result;
}
const createProduct = async function (req, res) {
    try {
        let body = req.body;
        let productImage = req.files

        if (productImage.length == 0) {
            return res.status(400).send({ status: false, message: "Plesae upload the profile image." });
        } else if (productImage.length > 1) {
            return res.status(400).send({ status: false, message: "Plesae upload only one image." });
        }
        if (!isValidImage(productImage[0].originalname)) {
            return res.status(400).send({ status: false, message: "Please upload only image file" });
        }

        if (productImage && productImage.length > 0) {
            var uploadedFileURL = await uploadFile(productImage[0])
            productImage = uploadedFileURL
        }
        else {
            return res.status(400).send({ msg: "No file found" })
        }

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Invalid Request Parameter, Please Provide Another Details" });
        }

        let { title, description, price, currencyId, currencyFormat, availableSizes,style,installments } = body;

        //validations
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "title is Required" })
        }
        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "description is Required" })
        }
        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: "price is Required" })
        }
        if(!(/^[0-9.,]+$/.test(price))) return res.status(400).send({status:false,message:'please enter only numbers as input'})
        if (!isValid(currencyId)) {
            return res.status(400).send({ status: false, message: "currencyId is Required" })
        }
        if(currencyId!=="INR") return res.status(400).send({ status: false, message: "Only INR is accepted" })
        if (!isValid(currencyFormat)) {
            return res.status(400).send({ status: false, message: "currencyFormat is Required" })
        }
        if(currencyFormat!=="₹") return res.status(400).send({ status: false, message: "Only ₹ is accepted" })
        let getUserDetails = await productModel.findOne({ title: title })
        if (getUserDetails) {
            return res.status(404).send({ status: false, msg: `This title is already in use` })
        }


        let validProductData = { title, description, price, currencyId, productImage, currencyFormat }
        if (style) {
            if (!isValid(style)) {
                return res.status(400).send({ status: false, message: "style is Required" })
            }
            if(!(/^[A-Za-z ]+$/.test(style))) return res.status(400).send({status:false,message:'put a valid style'})
            validProductData.style = body.style
        }
        if (installments) {
            if (!isValid(installments)) {
                return res.status(400).send({ status: false, message: "installments is Required" })
            }
            if(!(/^[0-9]{1,2}$/.test(installments))) return res.status(400).send({status:false,message:'put a valid installment'})
            validProductData.installments = body.installments
        }
        if (availableSizes) {
            if (!isValid(availableSizes)) {
                return res.status(400).send({ status: false, message: "availableSizes is Required" })
            }
            availableSizes = availableSizes.split(',').map((x)=>x.trim().toUpperCase())
            if (availableSizes.length == 0) return res.status(400).send({ status: false, message: 'availableSizes can not be empty' })

            let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
            availableSizes = availableSizes.map((x)=>x.trim())
            for (let i = 0; i < availableSizes.length; i++) {
                if (sizes.includes(availableSizes[i]) == false) {
                    return res.status(400).send({ status: false, message: 'Please put valid size' })
                }
        }
        validProductData.availableSizes = availableSizes
    }
        if (!isValid(productImage)) return res.status(400).send({ status: false, message: "Product image is required" })

    let productdata = await productModel.create(validProductData);
    return res.status(201).send({ status: true, message: 'Product created Successfully', data: productdata });
} catch (err) {
    console.log(err)
    return res.status(500).send(err.message)
}
}

const getProductById = async function (req, res) {
    try {
        let productId = req.params.productId
        if (!objectId.isValid(productId)) return res.status(400).send({ status: false, message: 'Please put a valid objectId😡😡' })
        let findData = await productModel.findOne({ isDeleted: false, _id: productId })
        if (!findData) return res.status(404).send({ status: false, message: 'No data found😭😭' })
        return res.status(200).send({ status: true, data: findData })


    } catch (err) {
        return res.status(500).send(err.message)
    }
}
const isValidNumber=(price)=>{
    if(/^[0-9]+([.][0-9]+)?$/.test(price))
    return true
}
const isValidTitle=(title)=>{
    if(/^[a-zA-Z]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9])$/.test(title))
    return true
}
const updateProductDetails = async function (req, res) {
    try {
        const productId = req.params.productId
        const image = req.files
        const updateData = req.body

        let { title, description, price, style, availableSizes, installments,isFreeShipping } = updateData

        if (!objectId.isValid(productId)) return res.status(400).send({ status: false, msg: "invalid product Id" })

        if ((Object.keys(updateData).length == 0)) return res.status(400).send({ status: false, msg: "please provide data to update" })

        if (image && image.length > 0) {
            if (!isImageFile(image[0].originalname)) return res.status(400).send({ status: false, message: "Please provide image only" })
            let updateProductImage = await uploadFile(image[0])
            updateData.productImage = updateProductImage
        }

        if (typeof title != undefined) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "title Should be Valid" })
            if (!isValidTitle(title)) return res.status(400).send({ status: false, message: "title should not contain number" })
            if (await productModel.findOne({ title })) return res.status(400).send({ status: false, message: "the title is same as the present title of this product" })
        }
        if (description != undefined) {
            if (!isValid(description)) return res.status(400).send({ status: false, message: "description Should be Valid" })
        }
        if (price != undefined) {
            if (!isValidNumber(price)) return res.status(400).send({ status: false, message: "price Should be Valid" })
        }

        if (style != undefined) {
            if (!isValid(style)) return res.status(400).send({ status: false, message: "style Should be Valid" })
            //if (!isValidString(style)) return res.status(400).send({ status: false, message: "style Should Not Contain Numbers" })
        }
        if (availableSizes != undefined) {
            if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "availableSizes Should be Valid" })
            availableSizes = availableSizes.split(",").map(x => x.trim().toUpperCase())
            //if (availableSizes.map(x => isValidSize(x)).filter(x => x === false).length !== 0) return res.status(400).send({ status: false, message: "Size Should be Among  S,XS,M,X,L,XXL,XL" })
            updateData.availableSizes = availableSizes
        }
        if (installments != undefined) {
            if (isValidString(installments)) return res.status(400).send({ status: false, message: "installments Should be whole Number Only" })
        }
        if(isFreeShipping){
            if(isFreeShipping !== ("true" || "false")) return res.status(400).send({status:false,message:'isFreeShipping must be a boolean value'})
        }

        const updateDetails = await productModel.findByIdAndUpdate({ _id: productId, isDeleted: false }, updateData, { new: true }).select({_v:0})
        if(!updateDetails) return res.status(404).send({status:false,message:'No data found with this objectId'})
        return res.status(200).send({ status: true, message: "User profile updated successfully", data: updateDetails })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message })
    }
}
const deleteProducts = async function(req, res)
{
    try{
        let productId = req.params.productId;
        if(!objectId)
        {
            return res.status(400).send({ status: false, message: "Please provide valid productId in params"})
        }
        let product = await productModel.findOneAndUpdate({_id: productId, isDeleted: false }, {$set: { isDeleted: true, deletedAt: new Date() }});
        if(!product)
        {
            return res.status(404).send({ status: false, message: "Product does not exist"});
        }
        
        return res.status(200).send({status: true, message: "Product deleted successfully"});
        
    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message});
    }
}

module.exports = { createProduct, getProductById,updateProductDetails,deleteProducts}