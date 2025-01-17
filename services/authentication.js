const JWT = require("jsonwebtoken");

const secretKey = "MenAreBrave";// It could be anything in string format

//Creting user token
function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImage: user.profileImage, 
        role: user.role,
    };

    const token = JWT.sign(payload, secretKey);
    return token;
}

//Validation user token
function validateToken(token){
    const payload = JWT.verify(token, secretKey);
    
    return payload;
}
    
module.exports = {
    createTokenForUser,
    validateToken,
}