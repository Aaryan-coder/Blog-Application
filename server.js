require("dotenv").config()
const express = require("express");
const userRoutes = require("./routes/users/users.js");
const postRoutes = require("./routes/posts/posts.js");
const commentRoutes = require("./routes/comments/comments.js");
const globalErrHandler = require("./middlewares/globalHandler.js");
const session = require("express-session")
const MongoStore = require("connect-mongo")
const methodOverride = require("method-override");
const Post = require("./models/post/Post.js");
require("./config/dbConnect.js")
const {truncatePost} = require("./utils/helpers")
const app = express();

app.locals.truncatePost = truncatePost
//middleware
//configure ejs
app.set("view engine","ejs")
//serve static files
app.use(express.static("public"))
app.use(express.json())//pass incoming data
app.use(express.urlencoded({extended: true}))//form data
//method override
app.use(methodOverride("_method"))
//session
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl:  process.env.MONGO_URL,
        ttl: 24*60*60//1 Day
    })
}))
//save the login user as locals
app.use((req,res,next)=>{
    if(req.session.userAuth){
        res.locals.userAuth = req.session.userAuth
    }else{
        res.locals.userAuth = null;
    }
    next()
})
//render home
app.get('/',async(req,res)=>{
    try{
        const posts = await Post.find().populate("user")
        res.render("index",{posts})
    }catch(error){
        res.render('index',{error:error.message})
    }
})
//User Route
app.use('/api/v1/users',userRoutes)

//post route
app.use('/api/v1/posts',postRoutes)

//comment route
app.use("/api/v1/comments",commentRoutes)

//error handler middlewares
app.use(globalErrHandler)

//listen server
const PORT = process.env.PORT || 9000
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`))