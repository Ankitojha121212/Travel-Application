const User = require("../models/user");

module.exports.signup = async (req,res)=>{

    try{

        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Registered Successfully !!!");
            // console.log(registeredUser);
            res.redirect("/listings");

        })
        
    }catch(e){
        req.flash("error",e);
        res.redirect("/listings");
    }

    };

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) =>{
    let {username} = req.body;
    req.flash("success",`Happy to see you  ${username} Again !!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};


module.exports.logout = (req,res,next) => {
    req.logout((err)=>{
        if(err){
            next(err);
        } else{
            req.flash("success","logged out Successfully");
            res.redirect("/listings");
        }
    })
};