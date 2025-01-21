const {model, Schema} = require("mongoose");

const commentSchema = new Schema({
    comment:{
        type:String,
        required:true,
    },
    blogId:{
        type: Schema.Types.ObjectId,
        ref: "blog",
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user", //reference from the user collection
    },
},{timestamps:true});

const Comment = model("Comment", commentSchema);

module.exports = Comment;