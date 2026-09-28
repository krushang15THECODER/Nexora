import openRouter from "../config/openRouter.js";
import Chat from "../model/chatSchema.js";
import message from "../model/msgSchema.js"
import mongoose from "mongoose";
import generateAIResponse from "../service/openRouterServices.js"
import {buildMessagesForAI} from "../utils/chatContext.js"
// import { addUserTokenUsage,hasTokenLimitReached, resetUsageIfNeeded } from "../utils/userUsage.js";
import { addUserTokenUsage } from "../utils/userUsage.js";

import { redisClient } from "../config/redis.js";
import {addChatTokenUsage} from "../utils/tokenUsage.js"
import { updateSummaryIfNeeded } from "../service/summaryService.js";

export const getMsg=async(req,res)=>{
    try{
        const {chatId}=req.params;
       const chat=await Chat.findOne({_id:chatId,userId:req.user._id});
        if(!chat){
            return res.status(404).json({
                message:"Chat not Found"
            })
        }
        const msgs=await message.find({
            chatId:chatId
        }).sort({createdAt:1});
        res.status(200).json({
            message:"You are all message are here",
            msg:msgs
        });
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

// export const sendMsg=async(req,res)=>{
//      try{
//         const {chatId}=req.params;
//         const {content}=req.body;

//         //validate msg content 
//         if(!content || content.trim()==="")
//         {
//             return res.status(400).json({
//                 message:"No message is sent"
//             })
//         }


//         //verify that chatID belonggs to a particular user
//         const chat=await Chat.findOne({
//             _id:chatId,
//             userId:req.user._id
//         });
//    const userMsg=messsage.create({
//             userId:req.user._id,
//             chatId:chatId,
//             role:"user",
//             content:content
//         });
//         const dummyreply="Mein to mast hun ,AP kaise hai !";
//          const assistantMsg=messsage.create({
//             userId:req.user._id,
//             chatId:chatId,
//             role:"assistant",
//             content:dummyreply
//         });
//         res.status(201).json({
//             message:dummyreply
//         })
//      }
//     catch(e){
//         console.log(e);
//         res.status(500).json({
//             message:"Internal Server Error"
//         })
//     }
// }
 

export const sendMsg = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, model } = req.body;

    // 1. Validate message content
    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Message content is required"
      });
    }

    // await resetUsageIfNeeded(req.user);
    // if(hasTokenLimitReached(req.user))
    // {
    //   return res.status(429).json({
    //     message:"Token limit reached.Please try after some time.",
    //     usage:req.user.usage,
    //   })
    // }

    let chat;

    // 2. Existing chat case
    if (chatId) {
      // Check valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({
          message: "Invalid chat id"
        });
      }

      chat = await Chat.findOne({
        _id: chatId,
        userId: req.user._id
      });

      if (!chat) {
        return res.status(404).json({
          message: "Chat not found"
        });
      }
    }

    // 3. New chat case
    else {
      if (!model) {
        return res.status(400).json({
          message: "Model is required for new chat"
        });
      }

      chat = await Chat.create({
        userId: req.user._id,
        model,
        topic: content.trim().slice(0, 40)
      });
    }

    // 4. Save user message
  

    // 5. Dummy AI reply for now
   const oldMessages = await message.find({
      chatId: chat._id,
    })
      .sort({ createdAt: 1 })
      .skip(chat.summarizedTillMsgNum);

    const messagesForAI = buildMessagesForAI({
      chat,
      oldMessages,
      currentMessage: content.trim(),
    });

    const { aiReply, usage } = await generateAIResponse({
      model: chat.model,
      messages: messagesForAI,
    });
  
    // Later we will replace this with OpenRouter response
  

    

    // 6. Save assistant message

      const userMessage = await message.create({
      chatId: chat._id,
      role: "user",
      content: content.trim(),
        userId:req.user._id
    });

    const assistantMessage = await message.create({
      chatId: chat._id,
      role: "assistant",
      content: aiReply,
      userId:req.user._id
    });

    // 7. Update chat metadata
    chat.msgCount += 2;

    // If topic is still default, update it from first message
    if (chat.topic === "New Chat") {
      chat.topic = content.trim().slice(0, 40);
    }

    // await chat.save();
        await addChatTokenUsage(chat, usage);
    await addUserTokenUsage(req.user, usage.totalTokens);
    
const tokenUsed = await redisClient.incrBy(
    req.tokenUsageKey,
    usage.totalTokens
);

if (tokenUsed === usage.totalTokens) {
    await redisClient.expire(
        req.tokenUsageKey,
        Number(process.env.TOKEN_WINDOW_SECONDS)
    );
}
    // 8. Send response
    res.status(201).json({
      message: "Message sent successfully",
      chatId: chat._id,
      reply: aiReply,
      usage,
       tokenUsed,
    tokenLimit: Number(process.env.TOKEN_LIMIT),
      userMessage,
      assistantMessage,
    });

updateSummaryIfNeeded(chat._id).catch((error) => {
    console.log("Summary update error:", error);
});  } 
  catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};