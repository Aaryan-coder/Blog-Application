const mongoose = require("mongoose")
//Schema
const postSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        category:{
            type: String,
            required: true,
            enum: ["react js","html","css","node js","javascript","other"]
        },
        image:{
            type: String,
            required: true
        },
        //A post will have only 1 user
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        //Post can have multiple comments
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }]
    },
    {
        timestamps: true,
    }
)

const Post = mongoose.model("Post",postSchema)

module.exports = Post