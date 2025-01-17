const{createHmac, randomBytes} = require("crypto")
const {Schema, model} = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema({
    fullName:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        unique: true,
        required:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        default:"/images/profile_Image.png",
    },
    role:{
        type:String, 
        enum: ["USER","ADMIN"],//Available role for user
        default: "USER",
    },
},{timestamps:true});

userSchema.pre("save", function (next){
    const user = this;

    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    //Encrypting user password using sha256 algorithm and salt as a secret key
    const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password =hashedPassword;

    next();
});

userSchema.static("matchePasswordAndGenerateToken", async function(email, password){
    const user  = await this.findOne({email});

    //If there is no user in database
    if(!user) throw new Error("User not found in database");

    const salt = user.salt;
    const hashedPassword = user.password;

    const currHashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if(currHashedPassword !== hashedPassword) throw new Error("Incorrect user credentials")

    //If both currHashedPassword and hashedPassoword are matched then user is present in the db
    const token = createTokenForUser(user);
    return token;
})

//Building model
const User = model('user', userSchema);

module.exports = User;