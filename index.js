import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express from "express"
import dotenv from "dotenv"
dotenv.config();
import connectDB from "./config/database.js"
import {connectRedis} from "./config/redis.js"


import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/userRouter.js"
import msgRouter from "./routes/msgRouter.js"
import chatRouter from "./routes/chatRouter.js"

const app=express();

app.use(cors({
  origin: "https://nexora-mauve-alpha.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/user",userRouter);
app.use("/msg",msgRouter);
app.use("/chat",chatRouter); 

const startserver=async()=>{
    try{

   await connectDB();
   await connectRedis();
const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(` Server is listening on port ${PORT}`);
        console.log(` Local: http://localhost:${PORT}`);
    });
    }
    catch(e){
        console.log("Connection failed!!!!!!! ❌");
        console.log(e.message);
    }

}


startserver();