import mongoose from "mongoose"

const msgSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    role:{
        type:String,
        enum:["user","assistant"],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    tokens:{
        type:Number,
        default:0
    },
    usage:{
        promptTokens:{
            type:Number,
            default:0
        },
        completionTokens:{
             type:Number,
            default:0
        },
        totalTokens:{
             type:Number,
            default:0
        }
    }
},{timestamps:true});

msgSchema.index({chatId:1,createdAt:1});
msgSchema.index({userId:1,createdAt:-1});

const message=mongoose.model("message",msgSchema);

export default message;