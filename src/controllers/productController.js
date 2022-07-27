const productModel = require('../models/productModel')
const { uploadFile } = require('../middleWare/fileUpload')


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

        let { title, description, price, currencyId, currencyFormat, availableSizes } = body;

        //validations
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "title is Required" })
        }
        title = title.trim();
        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "description is Required" })
        }
        description = description.trim();
        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: "price is Required" })
        }
        price = price.trim();
        if (!isValid(currencyId)) {
            return res.status(400).send({ status: false, message: "currencyId is Required" })
        }
        currencyId = currencyId.trim();
        if (!isValid(currencyFormat)) {
            return res.status(400).send({ status: false, message: "currencyFormat is Required" })
        }
        currencyFormat = currencyFormat.trim();
        
        if(availableSizes){
            if (!isValid(availableSizes)) {
                return res.status(400).send({ status: false, message: "availableSizes is Required" })
            }
            availableSizes = JSON.parse(availableSizes)

        }
       
        // console.log(availableSizes)
        // availableSizes = {$all:availableSizes.split(',')}
        // console.log(availableSizes)
        //availableSizes = JSON.parse(availableSizes)
        // availableSizes = availableSizes.trim();

        // if (!phoneRegex.test(phone)) return res.status(400).send({ status: false, message: "Phone is not valid, enter a valid phone number" })
        // if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "Email is not valid" })
        // if (!passwordRegex.test(password)) return res.status(400).send({ status: false, message: "Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & # ] and length should be min of 8-15 charachaters" })
        // if (!nameRegex.test(fname)) return res.status(400).send({ status: false, message: "FName is not valid, only characters are allowed" })
        // if (!nameRegex.test(lname)) return res.status(400).send({ status: false, message: "LName is not valid, only characters are allowed" })


        let getUserDetails = await productModel.findOne({ title: title })
        if (getUserDetails) {
            return res.status(404).send({ status: false, msg: `This title is already in use` })
        }


        let validProductData = { title, description, price, currencyId, productImage, currencyFormat }
        if (body.style) {
            if (!isValid(body.style)) {
                return res.status(400).send({ status: false, message: "style is Required" })
            }
            validProductData.style = body.style
        }
        if (body.installments) {
            if (!isValid(body.installments)) {
                return res.status(400).send({ status: false, message: "installments is Required" })
            }
            validProductData.installments = body.installments
        }
        if (!isValid(productImage)) return res.status(400).send({ status: false, message: "Product image is required" })

        let productdata = await productModel.create(validProductData);
        return res.status(201).send({ status: true, message: 'Product created Successfully', data: productdata });
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

module.exports = { createProduct }