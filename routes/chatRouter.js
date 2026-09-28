import express from "express"
import authUserMiddleware from "../middlewares/authUserMiddleware.js";
import { getSingleChat,deleteChat,createNewChat,getRecentChat } from "../controllers/chatController.js";
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js";
import loadUserMiddleware from "../middlewares/loadUserMiddleware.js";

const chatRouter = express.Router();

chatRouter.use(authUserMiddleware);
chatRouter.use(authenticatedRateLimiter);
chatRouter.use(loadUserMiddleware);

//get recent chat:20 chats ,delte,new chAT,GET SINGLE CHAT
chatRouter.get("/getRecentChat",getRecentChat);
chatRouter.post("/createChat",createNewChat);
chatRouter.get("/getSingleChat/:chatId",getSingleChat);
chatRouter.delete("/deleteChat/:chatId",deleteChat);

export default chatRouter;
