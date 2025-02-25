const express = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");
const router = express.Router();

//Handling uploaded cover images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    },
  })
  
  const upload = multer({ storage: storage })

router.get("/add-new", (req, res)=>{
    return res.render("addBlog",{
        user: req.user,
    });
});

//get the blog by id
router.get("/:id", async(req, res)=>{
  const allBlog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId:req.params.id}).populate(
    "createdBy"
  );

  return res.render("blog",{
    user: req.user,
    blog:allBlog,
    comments,
  });
});

//Route for comment
router.post("/comment/:blogId", async(req, res)=>{
    await Comment.create({
      comment: req.body.comment,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });

    return res.redirect(`/blog/${req.params.blogId}`);
});


router.post("/", upload.single('coverImage'), async(req,res)=>{
    const {title, content} = req.body;
    const blog = await Blog.create({
        title, 
        content,
        createdBy: req.user._id,
        coverImage:`/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
});
module.exports = router;