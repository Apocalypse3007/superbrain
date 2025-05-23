import mongoose, { model, Schema } from "mongoose";
mongoose.connect("mongodb://localhost:27017/brain");


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})
export const Usermodel = model("User", UserSchema);



const ContentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    tags: [{
        tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
    }],
    type: {
        type: String,
        required: true,
    },
    extractedContent: {
        type: String,
        default: ''
    },
    embedding: {
        type: [Number],
        sparse: true,
        index: true
    },
    hasEmbedding: {
        type: Boolean,
        default: false
    },
    userId: { 
        type: mongoose.Types.ObjectId, 
        ref: "User", 
        required: true                      
    }
}, {
    timestamps: true
})
export const Contentmodel = model("Content", ContentSchema);




const TagSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: [{ type: mongoose.Types.ObjectId, ref: "content" }],
})
export const Tagmodel = model("Tag", TagSchema);


const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});
export const Linkmodel = model("Links", LinkSchema);







