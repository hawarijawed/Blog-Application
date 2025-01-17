const express = require("express");
const mognoos = require("mongoose");
const path = require("path")
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");


const app = express();
const PORT = 8002;

//Connecting to database
mongoose.connect("mongodb://localhost:27017/Blogify")
.then(()=>console.log("Database connected Successfully"));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use(checkForAuthenticationCookie("token"));
//Express does not provide image on its own, it needs to me mentioned explicitely
app.use(express.static(path.resolve("./public")));//In order to retrieve images from the folder
app.get("/", async (req, res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use("/user", userRoute);
app.use("/blog",blogRoute);
app.listen(PORT, ()=>console.log("App started on port", PORT));