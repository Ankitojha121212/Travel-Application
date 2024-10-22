if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
};


// Requireing the essential things for my project

const express = require('express');
const app = express();
const mongoose = require("mongoose");


const dbUrl = process.env.ATLASDB_URL;



const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const multer = require("multer");
const upload = multer({dest : 'uploads/'});

const session = require('express-session');
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require("passport-local");
const User= require('./models/user.js');
const { register } = require('module');



const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');





///// Built In Middlewares
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended : true}));


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRETE,
    },
    touchAfter : 24 * 3600,


});

store.on("error" ,()=>{
    console.log("ERROR IN MONGO SESSION STORE : ",err);
});

/////  Session usage
const sessionOptions = {
    store,
    secret : process.env.SECRETE,
    resave : false,
    saveUninitialized : true,
    cookie : {

        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
            },
    };


app.use(session(sessionOptions));
app.use(flash());

// Authentication 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
















// Connecting the routes files with Main file
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



///// connection of mongoDB Database
async function main(){
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("DB Connected");
}).catch((err)=>{
    console.log(err);
})


// ////// Some rendering and routes process
// app.get("/",(req,res)=>{
//     res.redirect("/");
// })


// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email : "StudyCollage@gmail.com",
//         username : "Alpha kumar"
//     });

//     let registeredUser = await User.register(fakeUser,"Ramtajogi");
//     res.send(registeredUser);

// })


///// all type of Wrong routes Error handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !!!!!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="unknown error found!!#!!"} = err;
    res.status(statusCode).render("error.ejs",{message});
});

// listen of server at port number;
app.listen(8080,()=>{
    console.log("Server started");
})