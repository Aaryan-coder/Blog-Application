const mongoose = require("mongoose")

const dbConnect = async() =>{
    console.log(process.env)
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB connected Successfully")
    }
    catch(error){
        console.log("DB Connection failed",error.message)
    }
}

dbConnect()