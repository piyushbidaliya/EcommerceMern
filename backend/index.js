const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const { type } = require("os");

app.use(express.json());
app.use(cors());

// Database connection with mongodb
mongoose.connect("mongodb+srv://piyushbidaliya:pLsAOmhjElPHKhjP@cluster0.cxuqcyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
, {
    serverSelectionTimeoutMS: 30000,  // 30 seconds timeout for server selection
    socketTimeoutMS: 45000,           // 45 seconds timeout for socket operations
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});


// Api creation
app.get("/", (req, res)=>{
    res.send("Express App is running")
})

// image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) =>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})
// creating upload endpoint for images
app.use('/images', express.static('upload/images'))
app.post("/upload", upload.single('product'), (req, res)=>{
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
})

app.post("/addproduct", async(req, res)=>{
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }else{
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })
    console.log(product)
    await product.save()
    console.log("Saved")
    res.json({
        success:true,
        name:req.body.name,
    })
})

// creating api for remove products
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Removed");
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove product',
        });
    }
});

// creating api for get all products
app.get('/allproducts', async (req, res) => {
    try {
        // Fetch all products from the database
        let products = await Product.find({});
        
        // Log the retrieved products for debugging
        console.log("All products fetched:", products);

        // Check if products were found
        if (products.length === 0) {
            console.log("No products found in the database");
            return res.status(404).send({ message: 'No products found' });
        }

        // Send the products in the response
        res.send(products);
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).send({ message: 'Failed to fetch all products' });
    }
});


// Schema user model
const User = mongoose.model('User', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

// creating endpoint for registering the user
app.post('/signup', async(req, res) =>{
    let check = await User.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success: false, errors: "User already Exist"})
    }
    let cart = {}
    for (let i = 0; i < 300; i++ ){
        cart[i] = 0;
    }
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save()
    const data = {
        user: {
            id: user.id
        }
    }
    const token = jwt.sign(data, 'secret_ecom')
    res.json({success: true, token})
})

// creating endpoint for user login
app.post('/login', async(req, res)=>{
    let user = await User.findOne({email:req.body.email})
    if(user){
        const passMatch = req.body.password === user.password
        if(passMatch){
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom')
            res.json({success:true, token})
        }else{
            res.json({success:false, errors:"Wrong Password"})
        }
    }else{
        res.json({success:false, errors:"Wrong Email address"})
    }
})

// creating endpoint for latest products
app.get('/newcollection', async(req, res) =>{
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8)
    console.log("Newcollection Fetched")
    res.send(newcollection)
})

// creating endpoint for popular products
app.get('/popularproducts', async (req, res) => {
    try {
        let products = await Product.find({ category: "women" });
        if (products.length === 0) {
            console.log("No products found in the 'men' category");
            return res.status(404).send({ message: 'No products found' });
        }
        let popularproducts = products.slice(0, 4);
        console.log("Popular products fetched:", popularproducts);
        res.send(popularproducts);
    } catch (error) {
        console.error("Error fetching popular products:", error);
        res.status(500).send({ message: 'Failed to fetch popular products' });
    }
});




// creating middlewear to fetch user
const fetchUser = async(req, res, next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({errors: "Please authenticate using valid login"})
    }else {
        try {
            const data = jwt.verify(token, 'secret-ecom')
            req.user = data.user
            next()
        }catch (error){
            res.status(401).send({errors:"please authenticate using a valid token"})
        }
    }
}

// creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async(req, res) =>{
    console.log(req.body, req.user)
})

app.listen(port, (error) =>{
    if(!error){
        console.log("server is running on port" + port);
    }else{
        console.log("Error: " + error);
    }
})