require('dotenv').config()

const ProductModel = require('../model/product.model');

// sharp is used for image resizing
const sharp = require('sharp');

// crypto is used for generate unique image name
const crypto = require('crypto')
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// aws s3 services 
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


// aws s3 bucket credentials

const bucketName = process.env.bucketName
const bucketRegion = process.env.bucketRegion
const accessKey = process.env.accessKey
const secretAccessKey = process.env.secretAccessKey


// aws s3 client

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})





const CreateNewProduct = async (req, res) => {

    console.log(req.body);
    console.log(req.file);

    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
        console.log('Invalid File Type');
        return res.status(400).send({

            "error": "Invalid File Type",

            "msg": "Kindly Pass Only JPEG or PNG Image",

            "Success": fasle

        })
    }



    try {


        const buffer = await sharp(req.file.buffer).resize({ width: 400, height: 400, fit: "contain" }).toBuffer()

        const ImageName = randomImageName()

        const params = {
            Bucket: bucketName,
            Key: ImageName,
            Body: buffer,
            ContentType: req.file.mimetype
        }

        console.log('params for s3 ', params);

        const command = new PutObjectCommand(params)
        await s3.send(command)

        console.log('Product Image uploaded successfully to s3');
        const getObjectParams = {
            Bucket: bucketName,
            Key: ImageName
        }
        const command1 = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command1, { expiresIn: 604800 });

        // Get the current date
        const currentDate = new Date();

        // Add 7 days to the current date
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 7);

        // Remove 20 minutes from the future date
        futureDate.setMinutes(futureDate.getMinutes() - 20);
        console.log(futureDate);


        const product = new ProductModel({ ...req.body, Image: url, S3_Url: ImageName, S3_Url_ExipreDate: futureDate });
        await product.save();

        return res.status(200).send({
            "msg": "New Product has been Successfully Added into Database",
            "Success": true,
            "ProductInfo": product
        })


    } catch (error) {

        return res.status(400).send({
            "error": error.message,
            "msg": "Something Went Wrong",
            "Success": false
        })

    }

}





const UpdateProduct = async (req, res) => {

    const { productID } = req.params;

    console.log('update route pe request--->', productID);

    const { Title, Category, Quantity, Description, Price } = req.body;

    try {

        await ProductModel.findByIdAndUpdate({ _id: productID }, { Title, Category, Quantity, Description, Price })

        const product = await ProductModel.findById({ _id: productID })

        return res.status(200).send({

            "msg": "Product Info has been Updated Successfully.",

            "Success": true,

            "Product": product


        })

    }

    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong !",

            "Success": false


        })

    }


}


const UpdateProductImage = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const {productID} = req.params
    if (!req.file) {
        return res.status(400).send({
            "error": "Invalid File Type",
            "msg": "Kindly Pass Only JPEG or PNG Image",
            "Success": false
        })
    }
    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
        console.log('Invalid File Type');
        return res.status(400).send({
            "error": "Invalid File Type",
            "msg": "Kindly Pass Only JPEG or PNG Image",
            "Success": fasle
        })
    }



    try {

        const product = await ProductModel.findById({ _id: productID })
        if(!product){
            return res.status(404).send({
                "error": "Product Not Found",
                "msg": "Currently Product is not exits",
                "Success": fasle
            })
        }

        if(product.S3_Url){
            const params = { 
                Bucket : bucketName,
                Key : product.S3_Url
            }
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
            console.log('successfully deleted image from s3');
        }

        const buffer = await sharp(req.file.buffer).resize({ width: 400, height: 400, fit: "contain" }).toBuffer()

        const ImageName = randomImageName()
        const params = {
            Bucket: bucketName,
            Key: ImageName,
            Body: buffer,
            ContentType: req.file.mimetype
        }
        console.log('params for s3 ', params);
        
        const command = new PutObjectCommand(params)
        await s3.send(command)

        console.log('Product Image uploaded successfully to s3');
        const getObjectParams = {
            Bucket: bucketName,
            Key: ImageName
        }
        const command1 = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command1,{ expiresIn: 604800 });

        // Get the current date
        const currentDate = new Date();
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 7);
        futureDate.setMinutes(futureDate.getMinutes() - 20);

        await ProductModel.findByIdAndUpdate({ _id: productID }, { Image: url, S3_Url: ImageName, S3_Url_ExipreDate: futureDate })

        return res.status(200).send({
            "msg": "Product Image Successfully Updated",
            "Success": true
        })


    } catch (error) {

        return res.status(400).send({
            "error": error.message,
            "msg": "Something Went Wrong",
            "Success": false
        })

    }
}


const RemoveProduct = async (req, res) => {

    const { productID } = req.params;

    try {

        const product = await ProductModel.findById({ _id: productID })
        if(!product){
            return res.status(404).send({
                "error": "Product Not Found",
                "msg": "Currently Product is not exits",
                "Success": fasle
            })
        }

        if(product.S3_Url){
            const params = { 
                Bucket : bucketName,
                Key : product.S3_Url
            }
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
            console.log('successfully deleted image from s3');
        }


        await ProductModel.findByIdAndDelete({ _id: productID })

        return res.status(200).send({

            "msg": "Product has been Deleted Successfully from database.",

            "Success": true,


        })

    }

    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong !",

            "Success": false


        })

    }


}






const GetAllProducts = async (req, res) => {

    let { search, limit, page, price } = req.query;

    console.log("--->", search, limit, page, price)

    // limit = limit || 12;

    let pricerange;

    if (price) {

        console.log("--> pc", price)

        if (price === "asc" || price === 'desc') {

            if (price === 'asc') {
                pricerange = 1;
            }
            else {
                pricerange = -1;
            }


        }

        else {

            return res.status(400).send({

                "msg": "Please select a valid way to sort items .Price order must be in either ascending or descending",

                "Success": false
            })

        }
    }

    try {

        const searchFilter = new RegExp(search, 'i');

        // while Pagination
        const totalProducts = await ProductModel.find().count()
        res.append('X-Total-Count', totalProducts);
        res.append('Access-Control-Expose-Headers', 'X-Total-Count');

        let products = []

        if (pricerange) {

            console.log("hello", searchFilter, pricerange)

            products = await ProductModel.find({ Title: searchFilter }).sort({ Price: pricerange }).skip(limit * (page - 1)).limit(limit);

        } else {

            products = await ProductModel.find({ Title: searchFilter }).skip(limit * (page - 1)).limit(limit);

        }

        const currentDate = new Date();
        // Get the current date and get expiration date
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 7);
        futureDate.setMinutes(futureDate.getMinutes() - 20);

        for (let prod of products) {

            if (prod.S3_Url_ExipreDate && prod.S3_Url_ExipreDate < currentDate) {
                prod.S3_Url_ExipreDate = futureDate;

                const getObjectParams = {
                    Bucket: bucketName,
                    Key: prod.S3_Url
                }
                const command1 = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command1,{ expiresIn: 604800 });
                prod.Image = url;
                await ProductModel.findByIdAndUpdate({ _id: prod._id }, { S3_Url_ExipreDate: futureDate, Image: url })
            }

        }

        return res.status(200).send({
            "Success": true,
            "msg": "Product Fetched Succesfully.",
            "Products": products
        })

    }

    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong!",

            "Success": false

        })

    }

}



const GetOneProduct = async (req, res) => {

    const { productID } = req.params;

    try {

        const product = await ProductModel.findById({ _id: productID });

        const currentDate = new Date();
        // Get the current date and get expiration date
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 7);
        futureDate.setMinutes(futureDate.getMinutes() - 20);

        if (product.S3_Url_ExipreDate && product.S3_Url_ExipreDate < currentDate) {
            product.S3_Url_ExipreDate = futureDate;

            const getObjectParams = {
                Bucket: bucketName,
                Key: product.S3_Url
            }
            const command1 = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command1,{ expiresIn: 604800 });
            product.Image = url;
            await ProductModel.findByIdAndUpdate({ _id: product._id }, { S3_Url_ExipreDate: futureDate, Image: url })
        }



        return res.status(200).send({

            "Success": true,
            "msg": "Product Fetched Successfully",
            "Products": product
        })

    }

    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong!",

            "Success": false

        })
    }
}


const GetProductByCategory = async (req, res) => {

    const { Category } = req.params;

    let { search, limit, page, price } = req.query;

    console.log(search, limit, page, price, Category)

    // limit = limit || 12;

    let pricerange;

    if (price) {

        if (price === "asc" || price === 'desc') {

            if (price === 'asc') {
                pricerange = 1;
            }
            else {
                pricerange = -1;
            }

        }

        else {

            return res.status(400).send({

                "msg": "Please select a valid way to sort items .Price order must be either ascending or descending",

                "Success": false
            })

        }
    }

    try {

        const searchFilter = new RegExp(search, 'i');

        const totalProducts = await ProductModel.find().count()
        res.append('X-Total-Count', totalProducts);
        res.append('Access-Control-Expose-Headers', 'X-Total-Count');

        let products = []

        if (pricerange) {

            products = await ProductModel.find({ Title: searchFilter, Category }).sort({ Price: pricerange }).skip(limit * (page - 1)).limit(limit);

        } else {

            products = await ProductModel.find({ Title: searchFilter, Category }).skip(limit * (page - 1)).limit(limit);

        }

        const currentDate = new Date();
        // Get the current date and get expiration date
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 7);
        futureDate.setMinutes(futureDate.getMinutes() - 20);

        for (let prod of products) {

            if (prod.S3_Url_ExipreDate && prod.S3_Url_ExipreDate < currentDate) {
                prod.S3_Url_ExipreDate = futureDate;

                const getObjectParams = {
                    Bucket: bucketName,
                    Key: prod.S3_Url
                }
                const command1 = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command1,{ expiresIn: 604800 });
                prod.Image = url;
                await ProductModel.findByIdAndUpdate({ _id: prod._id }, { S3_Url_ExipreDate: futureDate, Image: url })
            }

        }

        return res.status(200).send({
            "Success": true,
            "msg": "Product Fetched Succesfully.",
            "Products": products
        })


    }

    catch (error) {

        return res.status(400).send({

            "error": error.message,

            "msg": "Something Went Wrong!",

            "Success": false

        })

    }


}






module.exports = {

    GetAllProducts,
    GetOneProduct,
    GetProductByCategory,
    CreateNewProduct,
    UpdateProduct,
    RemoveProduct,
    UpdateProductImage


}