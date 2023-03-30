const express = require('express');

const { connection } = require('./database/db');

const cartRouter = require('./routes/cart.route');

const orderRouter = require('./routes/order.route');

const productRouter = require('./routes/product.route');

const userRouter = require('./routes/user.route');

require('dotenv').config();

const app = express();


app.use(express.json());


app.use('/user',userRouter);

app.use('/product',productRouter);

app.use('/cart',cartRouter);

app.use('/order',orderRouter);



app.all("*", (req,res)=>{

    res.status(404).send({
        "error": `404 ! Invalid URL Detected.`
    })

})




app.listen(process.env.port, async (req,res)=>{

    try {

        await connection

        console.log('Connected to Mongo DB Atlas');

    } 
    
    catch (error) {

        console.log(error);

    }

    console.log(`Server is running at port ${process.env.port}`);

})