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

export const sendMsg = async (req, res) => {
  let chat;
  const { chatId } = req.params;
  const { content, model } = req.body;

  try {
    // 1. Validate message content
    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Message content is required"
      });
    }

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

      // Update the model if the user switched it in the UI
      if (model && chat.model !== model) {
        chat.model = model;
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

    // 4. Gather chat context
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

    // 5. Generate AI response from OpenRouter
    const { aiReply, usage } = await generateAIResponse({
      model: chat.model,
      messages: messagesForAI,
    });

    // 6. Save assistant and user message
    const userMessage = await message.create({
      chatId: chat._id,
      role: "user",
      content: content.trim(),
      userId: req.user._id
    });

    const assistantMessage = await message.create({
      chatId: chat._id,
      role: "assistant",
      content: aiReply,
      userId: req.user._id
    });

    // 7. Update chat metadata
    chat.msgCount += 2;

    // If topic is still default, update it from first message
    if (chat.topic === "New Chat") {
      chat.topic = content.trim().slice(0, 40);
    }

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
    });
  } 
  catch (err) {
    console.error("sendMsg error:", err);

    // If chat was newly created in this request and failed before saving messages, remove it
    if (!chatId && chat && chat._id) {
      await Chat.deleteOne({ _id: chat._id }).catch(() => {});
    }

    const rawError =
      err.data$?.error?.metadata?.raw ||
      err.data$?.error?.message ||
      err.error?.metadata?.raw ||
      err.error?.message ||
      err.message ||
      "";

    const isRateLimitedOrDown =
      err.statusCode === 429 ||
      err.status === 429 ||
      /rate-limit|temporarily unavailable|overloaded|provider returned error|model not found|no endpoints/i.test(rawError);

    const modelName = chat?.model || model || "the selected model";

    if (isRateLimitedOrDown) {
      return res.status(429).json({
        message: `The model "${modelName}" is currently busy or rate-limited upstream. Please change the current model (e.g. to Nemotron or GPT-4o-mini) and try again.`,
        isModelError: true,
        currentModel: modelName,
        details: rawError
      });
    }

    return res.status(503).json({
      message: `The model "${modelName}" is currently not responding or is unavailable. Please change the current model and try again.`,
      isModelError: true,
      currentModel: modelName,
      details: rawError
    });
  }
};
