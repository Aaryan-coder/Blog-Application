const express = require("express")
const { registerCtrl, loginCtrl, userDetailsCtrl, userProfileCtrl, profilePhotoCtrl, coverPhotoCtrl, passwordCtrl, logoutCtrl, updateUserCtrl } = require("../../controllers/users/users")
const userRoutes = express.Router()
const protected = require("../../middlewares/protected")
const storage = require("../../config/cloudinary")
const multer = require("multer")

//instance of multer
const upload = multer({storage})

//Rendering forms
//login form
userRoutes.get('/login',(req,res)=>{
    res.render("users/login.ejs",{
        error: ''
    })
})
//register form
userRoutes.get('/register',(req,resp)=>{
    resp.render("users/register",{
        error: ''
    })
})
//passwordform
userRoutes.get('/update-user-password',(req,res)=>{
    res.render("users/updatePassword",{
        error: ''
    })
})
/*
//profile template
userRoutes.get("/profile-page",(req,resp)=>{
    resp.render("users/profile")
})*/

//profile photo
userRoutes.get("/upload-profile-photo-form",(req,resp)=>{
    resp.render("users/uploadProfilePhoto",{
        error: ''
    })
})

//cover photo
userRoutes.get("/upload-cover-photo-form",(req,resp)=>{
    resp.render("users/uploadCoverPhoto",{
        error: ''
    })
})
/*
//update User
userRoutes.get("/update-user-form",(req,resp)=>{
    resp.render("users/updateUser")
})
*/

//register
userRoutes.post("/register", registerCtrl)

//POST/api/vi/users/login
userRoutes.post("/login",loginCtrl )

//GET/api/vi/users/profile/:id
userRoutes.get("/profile-page",protected, userProfileCtrl)

//PUT/api/vi/users/profile-photo-upload/:id
userRoutes.put("/profile-photo-upload",protected, upload.single('profile'), profilePhotoCtrl)

//PUT/api/vi/users/cover-photo-upload/:id
userRoutes.put("/cover-photo-upload",protected,upload.single('cover'), coverPhotoCtrl )

//PUT/api/vi/users/update-password/:id
userRoutes.put("/update-password", passwordCtrl)

//PUT/api/v1/users/update/:id
userRoutes.put("/update", updateUserCtrl)

//GET/api/vi/users/logout
userRoutes.get("/logout", logoutCtrl)

//GET/api/vi/users/:id
userRoutes.get("/:id", userDetailsCtrl)




module.exports = userRoutes