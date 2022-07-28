const express = require('express');
const { createUser, loginUser, getUser, updateUser } = require('../controllers/userController');
const { authentication, authorization } = require('../middleWare/auth');
const {createProduct,getProductById,updateProductDetails,deleteProducts} = require('../controllers/productController')


const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/user/:userId/profile', authentication, authorization, getUser);
router.put('/user/:userId/profile',  updateUser);

/*************PRODUCT ROUTES👍*************/
router.post('/products', createProduct)
router.get('/products/:productId', getProductById)
router.put('/products/:productId', updateProductDetails)
router.delete('/products/:productId',deleteProducts)




//FOR WRONG URL
router.all('/**', (req,res)=>{
    return res.status(404).send({msg : 'this url is invalid😥😥🙈🙈'})
})

module.exports = router;