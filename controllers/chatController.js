import Chat from "../model/chatSchema.js";
import message from "../model/msgSchema.js"



//get recent chat:20 chats ,delte,new chAT,GET SINGLE CHAT
export const getRecentChat=async(req,res)=>{
    try{
   const chats=await Chat.find({userId:req.user._id}).select("topic updatedAt")
   .sort({updatedAt:-1})
   .limit(20);
        res.status(200).json({
            message:"Your recent chats :",
            chats
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export const getSingleChat=async(req,res)=>{
   try{
    const {chatId}=req.params;
   const chat=await Chat.findOne({_id:chatId,userId:req.user._id}).select("topic updatedAt usage")
   .sort({updatedAt:-1})
   .limit(1);
   if(!chat){
    
       return res.status(404).json({
            message:"Chat not found",
        })

   }

     return res.status(200).json({
            message:"Your recent chats :",
            chatId:chat._id,
            userId:chat.userId,
            topic:chat.topic,
            usage:chat.usage
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
   
export const deleteChat=async(req,res)=>{
     try{
        const {chatId}=req.params;
        const chat=await Chat.findOne({_id:chatId,userId:req.user._id});
        if(!chat) 
        { 
             return res.status(404).json({
             message:"Chat doesn't exists"
        }) 
        } 

        await message.deleteMany({
            chatId:chat._id
        });

        await Chat.deleteOne(
            {
                _id:chatId
            }
        );
      
        res.status(200).json({
            message:"Your chat is deleted successfully"
        })
     }
    catch(e){
        console.log(e);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export const createNewChat=async(req,res)=>{
     try{
        const {model}=req.body;
        if(!model)
        {
            return res.status(400).json({
                message:"model name is missing"
            })
        }
       const chats=await Chat.create({
            userId:req.user._id,
            model
        })
        res.status(201).json({
            chatId:chats._id,
            userId:req.user._id,
            model,
            topic:chats.topic,
            createdAt:chats.createdAt
        })
     }
    catch(e){
        console.log(e);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
