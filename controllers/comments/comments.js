const Comment = require("../../models/comment/Comment")
const Post = require("../../models/post/Post")
const User = require("../../models/user/User")
const appErr = require("../../utils/appErr")

const createCommentCtrl = async(req,resp,next)=>{
    const {message} = req.body
    try{
        console.log(message)
        //FIND THE POST
        const post = await Post.findById(req.params.id)
        //cretae the comment
        const comment = await Comment.create({
            user: req.session.userAuth,
            message,
            post: post._id
        })
        console.log(comment)
        //push the comment to post
        post.comments.push(comment._id)
        console.log(post.comments)
        //find the user
        const user = await User.findById(req.session.userAuth);
        //push the comment
        user.comments.push(comment._id)
        console.log(comment)
        //disable validation
        //save
        await post.save({validateBeforeSave: false})
        await user.save({validateBeforeSave: false})
       /*
        resp.json({
        status: 'success',
        data: comment
    })*/
    resp.redirect(`/api/v1/posts/${post._id}`)
    }catch(error){
        next(appErr(error));
    }
}

const CommentDetailsCtrl = async(req,resp)=>{
    try{
        const comment = await Comment.findById(req.params.id)
      resp.render("comments/updateComment",{
        comment,
        error:"",
      })
    }catch(error){
        resp.render("comments/updateComment",{
            error:error.message
          })
    }
}

const updateCommentCtrl = async(req,resp,next)=>{
    console.log("query", req.query);
    const {message} = req.body
    try{
    //find the post 
    const comment = await Comment.findById(req.params.id)
    if(!comment){
        return next(appErr("Comment not found"))
    }
    //check if post belongs to user
    if(comment.user.toString()!== req.session.userAuth.toString()){
        return next(appErr("You are not allowed to delete the post",403))
    } 
    const commentUpdated = await Comment.findByIdAndUpdate(req.params.id,{
        message,
    },{
        new: true
    }) 
    console.log(req.query.postId)
    resp.redirect(`/api/v1/posts/${req.query.postId}`)
    }catch(error){
        next(appErr(error))
    }
}

const deleteCommentCtrl = async(req,resp,next)=>{
    try{
        //find the post
        const comment = await Comment.findById(req.params.id)
        //check if post belongs to user

        if(comment.user.toString()!== req.session.userAuth.toString()){
            return next(appErr("You are not allowed to delete this comment",403))
        }
       await Comment.findByIdAndDelete(req.params.id)
       resp.redirect(`/api/v1/posts/${req.query.postId}`)
    }catch(error){
        next(appErr(error))
    }
}

module.exports = {
    createCommentCtrl,
    CommentDetailsCtrl,
    updateCommentCtrl,
    deleteCommentCtrl
}