const express = require("express");
const User = require("../models/user");
const router = express.Router();
router.get("/signin", (req, res)=>{
    return res.render("signin");
})

router.get("/signup", (req, res)=>{
    return res.render("signup");
})


router.post("/signin", async (req, res)=>{
    const {email, password} = req.body;
    try {
        const token = await User.matchePasswordAndGenerateToken(email, password);
        console.log("User: ", token);
    
        //A cookie with name token is set for the user once authenticated
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        res.render("signin",{
            error:"Invalid login credentials",
        });
    }
});

router.get("/logout", (req, res)=>{
    return res.clearCookie("token").redirect("/");
})
router.post("/signup", async (req, res)=>{
    const {fullName, email, password} = req.body;

    await User.create({
        fullName,
        email,
        password,
    });

    return res.redirect("/");//Once user is signed up, user will be redirected to home page
})
module.exports = router;