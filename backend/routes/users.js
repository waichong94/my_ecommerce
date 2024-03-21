var express = require('express');
const jwt = require('jsonwebtoken');

var router = express.Router();

const Users = require('../models/User')

const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if(!token){
      res.status(401).send({
          errors: "Please authenticate using valid token."
      })
  }else{
      try {
          const data = jwt.verify(token, 'secret_ecom');
          req.user = data.user;
          next();
      } catch (error) {
          res.status(401).send({
              errors: "Please authenticate using a valid token."
          })
      }
  }
}

router.post('/signup', async (req,res) => {
    let check = await Users.findOne({email: req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"Existing user found with same email address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    })
    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, "secret_ecom");
    res.json({
        success: true,
        token: token
    })
})

// Creating Endpoint for user login
router.post('/login', async (req,res) => {
    let user = await Users.findOne({
        "email": req.body.email
    })
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({
                success:true,
                token
            })
        }else{
            res.json({
                success: false,
                errors:"Wrong password"
            })
        }
    }else{
        res.json({
            success: false,
            errors:"Wrong email id."
        })
    }
})


// creating endpoint for adding product in cartdata
router.post('/addtocart', fetchUser,async (req,res) => {
  let user = await Users.findOne({_id: req.user.id});
  if(!user){
      return res.status(400).json({
          success: false,
          errors: "Please login to add item to cart."
      })
  }
  user.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({_id: req.user.id},{cartData: user.cartData});
  console.log("Added");
  return res.send({
      success: true
  })
  
})

// creating endpoint for removing product in cartdata
router.post('/removefromcart', fetchUser,async (req,res) => {
  let user = await Users.findOne({_id: req.user.id});
  if(!user){
      return res.status(400).json({
          success: false,
          errors: "Please login to remove item to cart."
      })
  }
  if(user.cartData[req.body.itemId] > 0) user.cartData[req.body.itemId] -= 1;
  
  await Users.findOneAndUpdate({_id: req.user.id},{cartData: user.cartData});
  
  console.log("Removed");
  return res.send({
      success: true
  })
  
})

// creating endpoint to get cart
router.post('/getcart', fetchUser, async (req,res) => {
  console.log("Get cart");
  let userData = await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
})

module.exports = router;
