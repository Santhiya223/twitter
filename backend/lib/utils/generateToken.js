import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const cookie = jwt.sign({userId}, process.env.JWTSECRET, {
        expiresIn: "15d"
    });

    res.cookie("jwt", cookie,
        {
            maxAge: 15*24*60*60*1000,
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks
            sameSite: "strict", //CSRF attacks cross-site forgery attacks
            secure: process.env.NODE_ENV !== "development"
        }
    )

}
