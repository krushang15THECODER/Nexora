import express from "express"
import authUserMiddleWare from "../middlewares/authUserMiddleware.js"
import tokenUsageMiddleware from "../middlewares/tokenUsageMiddleware.js";
import loadUserMiddleware from "../middlewares/loadUserMiddleware.js";
import {getMsg,sendMsg} from "../controllers/msgController.js"
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js";

const msgRouter=express.Router();
msgRouter.use(authUserMiddleWare);
msgRouter.use(authenticatedRateLimiter);

msgRouter.post("/",tokenUsageMiddleware,loadUserMiddleware,sendMsg);

msgRouter.get("/:chatId",loadUserMiddleware,getMsg); 
msgRouter.post("/:chatId",tokenUsageMiddleware,loadUserMiddleware,sendMsg);

export default msgRouter;