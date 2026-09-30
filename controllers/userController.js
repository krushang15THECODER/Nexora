import User from "../model/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {signupSchema,loginSchema} from "../validators/userValidators.js"
import Chat from "../model/chatSchema.js"
import Message from "../model/msgSchema.js"

const createToken=(id,email)=>{
    if(!process.env.JWT_SECRET)
    {
        throw new Error("JWt token key not found")
    }
    const token=jwt.sign({id,email},process.env.JWT_SECRET,{expiresIn:"1h"});
    return token;

}

const cookiesOption={
    httpOnly:true,
    secure: true,
    sameSite: "none",
    maxAge:1*60*60*1000
}

export const login=async(req,res)=>{
    try{
        const result =loginSchema.safeParse(req.body);
         if(!result.success){
            return res.status(400).json(
                {
                    message:result.error.issues[0].message
                }
            )
        }

        const {email,password}=result.data;
        // if(!email||!password)
        // {
        //     return res.status(400).json({
        //         message:"Email and password is required field.PLZ fill all fields."
        //     })
        // }
        const existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(401).json({
                message:"User not Found.Please SignUp first."
            })
        }

        //match passwrod now
        const isMatch=await bcrypt.compare(password,existingUser.password);
        if(!isMatch){
            return res.status(401).json({
                message:"Authetication Failed.Check you email or password"
            });
        }
        const token=createToken(existingUser._id,email);
         res.cookie("token",token,cookiesOption);
         res.status(200).json({
            message:"Login successfull 🥳",
            usage:existingUser.usage
         });
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export const logout=async(req,res)=>{
     try{

        if(req.token){
            const token = req.token;
            const payload = req.tokenPayload;

            const currentTime = Math.floor(Date.now() / 1000);
            const remainingTime = payload.exp - currentTime;

            if (remainingTime > 0) {
                await redisClient.set(
                    `blocklist:${token}`,
                    "blocked",
                    {
                        EX: remainingTime
                    }
                );
            }
        }

        res.clearCookie("token",{
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        res.status(200).json({
            message: "User Logged Out Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const signup=async(req,res)=>{
    try{
        const result=signupSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json(
                {
                    message:result.error.issues[0].message
                }
            )
        }
        // const {name,age,email,password}=req.body;
         const {name,age,email,password}=result.data;
        // if(!email||!password||!name)
        // {
        //     return res.status(400).json({
        //         message:"email,password and name should not be empty"
        //     })
        // }
        const user=await User.findOne({email});
        if(user){
            return res.status(409).json({
                message:"Email Id alredy exists"
            })
        }

            const hashpass=await bcrypt.hash(password,10); 
            const userCreated=await User.create({
                name,age,email,
                password:hashpass
            });

            //create token
             const token=createToken(userCreated._id,email);
            res.cookie("token",token,cookiesOption);
            res.status(201).json({
                message:"User created SuccessFully 🥳"
            })

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

// export const profile=async(req,res)=>{
//     try{
//         const {email}=req.body;
//         if(!email){
//             return res.status(400).json({
//                 message:"Email is mising "
//             })
//         }
//         const existingUser=await User.findOne({email});
//          if(!existingUser){
//             return res.status(404).json({
//                 message:"Email invalid"
//             })
//         }
//         res.status(200).json({
//             name:existingUser.name,
//             email:existingUser.email,
//             age:existingUser.age,
//             // usage:existingUser.usage
//         })
//     }
//     catch(e){
//         console.log(e);
//         res.status(500).json({
//             message:"Internal server error"
//         })
//     }
// }
export const profile=async(req,res)=>{
        try{
            res.status(200).json({
                // message:"Information is here:",
                name:req.user.name,
                age:req.user.age,
                usage:req.user.usage,
                email:req.user.email


            })
        }
        catch(e){
              console.log(e);
        res.status(500).json({
            message:"Internal server error"
        })
        }
}

export const deleteAccount=async(req,res)=>{
    try{
        //findall chatid which belongs to this user
        const userId=req.user._id;

        //find all chatid which belongs to user
        const chats=await Chat.find({userId}).select("_id");
        const chatIds = chats.map((chat) => chat._id);
        //delete all msgsd of thi chatid
        await Message.deleteMany({
            chatId:{$in:chatIds}
        });
        await Chat.deleteMany(
            {
                userId
            }
        )
        //delete profile
        await User.deleteOne({
            _id:userId
        });
        res.clearCookie("token",{
            httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
         res.status(200).json({
      message: "Account deleted successfully"
    });
    }
    catch(e){
         res.status(500).json({
      message: "Internal server error"
    });
    }
}