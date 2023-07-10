const User = require("../../models/user/User")
const bcrypt = require("bcryptjs")
const appErr = require("../../utils/appErr")


const registerCtrl = async(req,resp,next)=>{
    const {fullname, email, password} = req.body
    console.log(req.body)
    //if field is empty
    if(!fullname||!email||!password){
        //return next(appErr("All fields are required"))
        return resp.render('users/register',{
            error: "All fields are required"
        })
    }
    try{
        //1. check if user exists(email)
        const userFound = await User.findOne({email});
        //throw an error
        if(userFound){
           // return next(appErr("User already exists"))
           return resp.render('users/register',{
            error: "Email already exists"
        })
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password,salt);
        //register user
        const user = await User.create({
            fullname,
            email,
            password: passwordHashed,
        })
        console.log(user)
        resp.redirect("/api/v1/users/profile-page")
        /*
        resp.json({
        status: 'success',
        data: user
    })*/
    }catch(error){
        resp.json(error)
    }
}

const loginCtrl = async(req,resp,next)=>{
    const {email,password} = req.body
    //console.log((req.session.loginUser = "Adit"))
    if(!email||!password){
        //return next(appErr("Email and Password Field are required"))
        return resp.render('users/login',{
            error: "Email and Password Field are required"
        })
    }
    try{
        //check if eail exists
        const userFound = await User.findOne({email})
        if(!userFound){
        // return next(appErr("Invalid Login Credentials"))
        return resp.render('users/login',{
            error: "Invalid login Credentials"
        })
        }
        //verify password
        const isPasswordValid = await bcrypt.compare(password,userFound.password)
        if(!isPasswordValid){
            return resp.render('users/login',{
                error: "Invalid login Credentials"
            })
        }
        //save the user into session
        req.session.userAuth = userFound._id
        console.log(req.session)
        resp.redirect("/api/v1/users/profile-page")
        /*
        resp.json({
        status: 'success',
        data: userFound
    })*/
    }catch(error){
        resp.json(error)
    }
}

const userDetailsCtrl = async(req,resp)=>{
    try{
        //console.log(req.params)
        const userId = req.params.id
        //find the user
        const user = await User.findById(userId)
       /* resp.json({
        status: 'success',
        data: user
    })*/
    resp.render("users/updateUser",{
        user,
        error: ''
    })
    } catch(error){
    resp.render("users/updateUser",{
            error: error.message,
        })
    }
}

const userProfileCtrl = async(req,resp)=>{
    try{
        //get the login user
        const userID = req.session.userAuth
        //find the user
        const user = await User.findById(userID).populate('posts').populate("comments")
       resp.render("users/profile",{user})
        /* resp.json({
        status: 'success',
        user: user
    })*/
    }catch(error){
        resp.json(error)
    }
}

const profilePhotoCtrl = async(req,resp,next)=>{
    console.log(req.file)
    try{
        //check if file exists
        if(!req.file){
            //return next(appErr("Please upload image",403))
            resp.render('users/uploadProfilePhoto',{
                error: 'Please upload image'
            })
        }
        //1. Find the user to be updated
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID)
        //2. Check if user is founf
        if(!userFound){
            //return next(appErr("User not found"),403)
            resp.render('users/uploadProfilePhoto',{
                error: 'User not found'
            })
        }
        //3. Update profile photo
        await User.findByIdAndUpdate(
            userID,
            {
                profileImage: req.file.path
            },
            {
                new: true
            }
        )
        resp.redirect("/api/v1/users/profile-page")
        /*
        resp.json({
        status: 'success',
        user: "Profile photo uploaded successfully"
    })*/
    }catch(error){
        return next(appErr(error.message))
    }
}

const coverPhotoCtrl = async(req,resp,next)=>{
    
    console.log(req.file)
    try{
        if(!req.file){
            //return next(appErr("Please upload image",403))
            resp.render('users/uploadCoverPhoto',{
                error: 'Please upload image'
            })
        }
        //1. Find the user to be updated
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID)
        //2. Check if user is founf
        if(!userFound){
            resp.render('users/uploadCoverPhoto',{
                error: 'User not found'
            })
        }
        //3. Update profile photo
        await User.findByIdAndUpdate(
            userID,
            {
                coverImage: req.file.path
            },
            {
                new: true
            }
        )
        resp.redirect("/api/v1/users/profile-page")
        /*
        resp.json({
        status: 'success',
        user: "Cover Image uploaded successfully"
    })*/
    }catch(error){
        return next(appErr(error.message))
    }
}
const passwordCtrl = async(req,resp,next)=>{
    const {password} = req.body;
    try{
        //check if user is updating the password
        if(!password){
            //return next(appErr("Email and Password Field are required"))
            return resp.render('users/updatePassword',{
                error: "Password Field are required"
            })
        }
        if(password){
            const salt = await bcrypt.genSalt(10)
            const passwordHashed = await bcrypt.hash(password,salt)
            //Update user
        await User.findByIdAndUpdate(
            //req.params.id
            req.session.userAuth,{
            password: passwordHashed
        },{
            new: true
        })
        resp.redirect("/api/v1/users/profile-page")
    }
}
catch(error){
    return  resp.render("users/updatePassword",{
        error: error.message,
    })
}
}

const updateUserCtrl = async(req,resp,next)=>{
    const {fullname,email} = req.body
    try{
        if(!fullname||!email){
            return  resp.render("users/updateUser",{
                error: "Please provide details",
                user:""
            })
        }
        //checkif email is taken
        if(email){
            const emailTaken = User.findOne(email)
            if(emailTaken===email){
                return  resp.render("users/updateUser",{
                    error: "Email is taken",
                    user:""
                })
            }
        }
        //update yser
       await User.findByIdAndUpdate(req.session.userAuth,{
            fullname,
            email
        },{
            new: true
        })
        resp.redirect("/api/v1/users/profile-page")
    }
    catch(error){
        return  resp.render("users/updateUser",{
            error: error.message,
            user:""
        })
    }
}
const logoutCtrl = async(req,resp)=>{
    //destroy session
    req.session.destroy(()=>{
        resp.redirect("/api/v1/users/login")
    })
   /* 
    try{resp.json({
        status: 'success',
        user: "User LOGOUT"
    })
    }catch(error){
        resp.json(error)
    }*/
}
module.exports = {
    registerCtrl,
    loginCtrl,
    userDetailsCtrl,
    userProfileCtrl,
    profilePhotoCtrl,
    coverPhotoCtrl,
    passwordCtrl,
    logoutCtrl,
    updateUserCtrl
}