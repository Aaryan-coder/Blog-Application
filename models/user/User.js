const mongoose = require("mongoose")
//Schema
const userSchema = new mongoose.Schema(
    {
        fullname:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
        },
        profileImage:{
            type: String
        },
        coverImage:{
            type: String
        },
        role:{
            type: String,
            default: "Blogger"
        },
        bio: {
            type: String,
            default:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum adipisci eligendi nobis itaque ex? Veniam tempore itaque cumque fugiat iusto voluptatibus odit inventore dolorem numquam maxime, repellendus labore corrupti expedita?"
        },
        //One to many: User can create multiple posts
        posts: [{
            type:mongoose.Schema.Types.ObjectId, 
            ref : "Post"
        }],
        comments: [{
            type:mongoose.Schema.Types.ObjectId, 
            ref : "Comment"
        }]
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User",userSchema)

module.exports = User