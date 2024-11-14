import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
 const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({error : "UnAuthorized - No token Provided"});
        }
    
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        if(!decoded) {
            return res.status(401).json({error : "UnAuthorized - Invalid token Provided"});
        }
    
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(401).json({error : "No User Found"});
        }
    
        req.user = user;
    
        next();
    } catch(e) {
        console.log(`error in protect routes middleware${e}`);
        return res.status(501).json({error : "Internal Server Error"});
    }
   
}

export default protectRoute;