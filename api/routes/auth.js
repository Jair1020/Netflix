const router = require('express').Router();
const User= require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//REGISTER
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY ).toString(),
    });
    try {
         const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

//LOGIN
router.post ("/login", async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
         if(!user) return res.status(401).json("Wrong email or password");
        const bytes  = CryptoJS.AES.decrypt(user.password.toString(), process.env.SECRET_KEY);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);

        const accessToken = jwt.sign({
            id: user._id, isAdmin: user.isAdmin
        }, process.env.SECRET_KEY, { expiresIn: '2d' });

        if(plaintext === req.body.password){
            const {password,...userWithoutPassword} = /* user._doc */ user.toObject();
            res.status(200).json({...userWithoutPassword, accessToken});
        }else {
            res.status(401).json("Wrong email or password");
        }
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;