var express = require('express');

var router = express.Router();

// Models
const Product = require('../models/Product')

router.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id = 1;
    if(products.length > 0){
        let last_product = products.slice(-1)[0];
        id = last_product.id + 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    })
})

router.post('/removeproduct', async (req,res) => {
    console.log(req.body);
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
})

router.get("/allproducts", async (req,res) => {
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})

// creating endpoint for new collection data
router.get('/newcollections', async (req,res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New collection fetched");
    res.send(newcollection);
})

// creating endpoint for popular in women section
router.get('/popularinwomen', async (req,res) => {
    let products = await Product.find({category: 'women'});
    let popular_in_women = products.slice(0,4)
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

module.exports = router;
