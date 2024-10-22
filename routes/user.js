const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const { signup, renderLoginForm, login, logout } = require('../controllers/users.js');



////////// SignUp process

router
    .route("/signup")
         .get((req,res)=>{
           res.render('users/signup.ejs')
             })
        .post( signup);


        ////////// login process
router
    .route("/login")
        .get(renderLoginForm)
        .post(saveRedirectUrl,
             passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}) ,wrapAsync( login ));





///////////// logOUt
router.get("/logout",logout);



module.exports = router;