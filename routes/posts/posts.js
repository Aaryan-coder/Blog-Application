const express = require("express")
const { createPostCtrl, deletePostCtrl, updatePostCtrl, fetchPostCtrl, fetchPostsCtrl } = require("../../controllers/posts/posts")
const protected = require("../../middlewares/protected")
const multer = require("multer")
const storage = require("../../config/cloudinary")
const Post = require("../../models/post/Post")
const postRoutes = express.Router()
//instamce of mukter
const upload = multer({
    storage
})

postRoutes.get("/get-post-form",(req,res)=>{
    res.render("posts/addPost",{
        error: ""
    })
})
postRoutes.get("/get-form-update/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.render("posts/updatePost",{
            post,
            error: ""
        })
    }
    catch(error){
        return res.render("posts/updatePost",{
            error: error.message,
            post: ""
        })
    }
})
postRoutes.post("/",protected,upload.single("file"), createPostCtrl)
//GET/api/vi/posts
postRoutes.get("/", fetchPostsCtrl)
//GET/api/vi/posts/:id
postRoutes.get("/:id", fetchPostCtrl)
//DELETE/api/vi/posts/:id
postRoutes.delete("/:id",protected, deletePostCtrl)

//PUT/api/vi/posts/:id
postRoutes.put("/:id",protected, upload.single("file"), updatePostCtrl)

module.exports = postRoutes