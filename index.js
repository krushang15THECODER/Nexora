import dns from "node:dns";
if (process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}
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

const allowedOrigins = [
  "https://nexora-mauve-alpha.vercel.app",
  "http://localhost:5173" // for local development
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // allow the specific listed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // allow any Vercel preview deployment
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/user",userRouter);
app.use("/msg",msgRouter);
app.use("/chat",chatRouter);

// Health check endpoint to keep the server awake on free hosting tiers
app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});


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