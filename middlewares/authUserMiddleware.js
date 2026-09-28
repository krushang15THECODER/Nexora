import jwt from "jsonwebtoken"
import User from "../model/userSchema.js"
import { redisClient } from "../config/redis.js";
const authuserMiddleware=async(req,res,next)=>{
        try{
            const {token}=req.cookies;
            if(!token){
               return res.status(401).json(
                    {
                        message:"You need to login first"
                    }
                )
            }
            

            const payload=jwt.verify(token,process.env.JWT_SECRET);
             const blockedToken = await redisClient.get(
            `blocklist:${token}`
             );
             if (blockedToken) {
            return res.status(401).json({
                message: "Please login again"
            });
        }
            // const existingUser= await User.findById(payload.id);
        //     if(!existingUser){
        //         return res.status(401).json(
        //             {
        //                 message:"User doesn't exist"
        //             }
        //         )
        //     }
        //     req.user=existingUser;
        //     req.token = token;
        // req.tokenPayload = payload;
          req.userId = payload.id;
        req.token = token;
        req.tokenPayload = payload;
            next();
        }
        catch(e){
              if (
            e.name === "JsonWebTokenError" ||
            e.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }
            console.log(e);
            res.status(500).json({
                message:"internal server error"
            })
        }
}


export default authuserMiddleware;