const Post = require("../../models/post/Post")
const User = require("../../models/user/User")
const appErr = require("../../utils/appErr")

const createPostCtrl = async(req,resp,next)=>{
    const {title, description, category} = req.body
    try{
        if(!title || !description || !category || !req.file){
            //return next(appErr("All files are required"))
            return resp.render("posts/addPost",{
                error: "All files are required"
            })
        }
        //Find the User
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId)
        //Create the post
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: userFound._id,
            image: req.file.path
        })
        //push the ppst created into the array of users posts
        userFound.posts.push(postCreated._id)
        //re save
        await userFound.save()
        /*
        resp.json({
        status: 'success',
        data: postCreated
    })*/
    resp.redirect("/")
    }catch(error){
        return resp.render("posts/addPost",{
            error: error.message
        })
    }
}

//all
const fetchPostsCtrl = async(req,resp,next)=>{
    try{
        const post = await Post.find().populate("comments").populate("user") 
        resp.json({
        status: 'success',
        data: post
    })
    }catch(error){
        next(appErr(error.message))
    }
}

//details
const fetchPostCtrl = async(req,resp,next)=>{
    try{
        //get the id from param
        const postID = req.params.id;
        const post = await Post.findById(postID).populate(
            {
                path: "comments",
                populate: {
                    path: "user"
                }
            }
            ).populate("user")
        resp.render("posts/postDetails",{
            post,
            error:""
        })
    }catch(error){
        next(appErr(error.message))
    }
}

const deletePostCtrl = async(req,resp,next)=>{
    try{
        //find the post
        const post = await Post.findById(req.params.id)
        //check if post belongs to user
        console.log(post)
        console.log(post.user.toString())
        if(post.user.toString()!== req.session.userAuth.toString()){
            return resp.render("posts/postDetails",{
                post,
                error: "You are not authorized to delete this page"
            })
            //return next(appErr("You are not allowed to delete the post",403))
        }
       await Post.findByIdAndDelete(req.params.id)
        resp.redirect("/")
    }catch(error){
        return resp.render("posts/postDetails",{
            error: error.message,
            post:""
        })
    }
}
const updatePostCtrl = async(req,resp,next)=>{
    const {title, description, category} = req.body
    try{
    //find the post 
    const post = await Post.findById(req.params.id)
    //check if post belongs to user
    if(post.user.toString()!== req.session.userAuth.toString()){
        //return next(appErr("You are not allowed to delete the post",403))
        return resp.render("posts/updatePost",{
            post,
            error: "You are not authorized to update this page"
        })
    } 
    if(req.file){
        await Post.findByIdAndUpdate(req.params.id,{
            title,
            description,
            category,
            image: req.file.path
        },{
            new: true
        }) 
    }
    else{
        await Post.findByIdAndUpdate(req.params.id,{
            title,
            description,
            category,
        },{
            new: true
        }) 
    }
        resp.redirect("/")
    }catch(error){
        return resp.render("posts/updatePost",{
            post: "",
            error: error.message
        })
    }
}
module.exports = {
    createPostCtrl,
    deletePostCtrl,
    updatePostCtrl,
    fetchPostCtrl,
    fetchPostsCtrl
}