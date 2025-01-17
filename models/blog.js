const {Schema,model} = require("mongoose");

const blogSchme = new Schema({
    title: {
        type:String,
        required:true,
    },
    content:{
        type:String,
        required: true,
    },
    coverImage:{
        type: String,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user", //reference from the user collection
    },

    
},{timestamps:true});

const Blog = model("blog", blogSchme);

module.exports = Blog;