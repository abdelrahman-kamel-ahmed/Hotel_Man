const jwt = require("jsonwebtoken");
require("dotenv").config();
// Verify Token
exports.authMiddleware = function (request, response, next) {

    const authorization = request.headers?.authorization;
    console.log(authorization);

    // Check Authorization
    if (!authorization) {
        return response.status(401).json({ message: "un-authorized 1" });
    }

    const [type, token] = authorization.split(" ");
    
    // Check Type
    if (type !== "Bearer") {
        return response.status(401).json({ message: "Invalid Token Type" });
    }

    // Check Token
    if (!token) {
        return response.status(401).json({ message: "un-authorized 2" });
    }

    // Token
    try {
        const user =jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
        return response.status(401).json({ message: "Invalid or Expired Token" });
    }
        request.user = user; 
        next();
    } catch (error) {
        return response.status(401).json({ message: "Invalid Token or Expired" });
    }
};
