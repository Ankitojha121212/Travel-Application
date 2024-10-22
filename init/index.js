require('dotenv').config(); // Load env variables

const mongoose = require('mongoose');
const initData = require('./data');

const Listing = require('../models/listing');


const dbUrl = process.env.ATLASDB_URL;
///// connection of mongoDB Database
async function main(){
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("DB Connected");
}).catch((err)=>{
    console.log(err);
})

const initDB = async() => {
       await Listing.deleteMany({});
       initData.data = initData.data.map((obj)=>({
        ...obj ,owner : "67176f754f1350de5d6f0748"
       }));


       await Listing.insertMany(initData.data);
       console.log("Data was Saved !!");
}

initDB();