import express, { Request, Response } from "express";
import { middleware } from "./middleware";
import { JWT_SECRET } from "./config";
import { Usermodel,Linkmodel,Contentmodel,Tagmodel } from "./db";
import cors from "cors";
import bcrypt from "bcrypt";
import { SignupSchema,SigninSchema,ContentSchema } from "./types";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const app = express();
app.use(cors())
app.use(express.json())

app.post("/signup", async (req:Request, res:Response): Promise<any> => {
  const parsedData = SignupSchema.safeParse(req.body);
  if(!parsedData.success){
    console.log(parsedData.error);
    return res.json({
      error: "Incorrect inputs"
    })
  }
  try{
    const hashedPwd = await bcrypt.hash(parsedData.data.password,10);
    const user = await Usermodel.create({
      email: parsedData.data.email,
      password: hashedPwd,
      name: parsedData.data.name,
    })
    return res.json({
      userId: user.id
    })
    
  }catch(error){
    console.log(error);
    res.status(411).json({
      error: "User already exists"
    })
  }
});

app.post("/signin", async (req:Request, res:Response): Promise<any> => {
  const parsedData = SigninSchema.safeParse(req.body);
  if(!parsedData.success){
    console.log(parsedData.error);
    return res.json({
      error: "Incorrect inputs"
    })
  }
  try{
    const user = await Usermodel.findOne({
      email: parsedData.data.email
    });
    if(!user){
      return res.json({
        error: "User not found"
      })
    }
    const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);
    if(!isPasswordValid){
      return res.json({
        error: "Invalid password"
      })
    }
    const token = jwt.sign({ 
      userId: user.id 
    }, 
      JWT_SECRET);

     res.json({
      token
    })
  }catch(e){
    console.log(e);
    res.status(411).json({
      error: "Something went wrong"
    })
  }
})

app.post("/content", middleware, async (req:Request, res:Response): Promise<any> => {
  const parsedData = ContentSchema.safeParse(req.body);
  if(!parsedData.success){
    console.log(parsedData.error);
    return res.json({
      error: "Not login"
    })
  }
  try{
    const contentData: any = {
      title: parsedData.data.title,
      link: parsedData.data.link,
      type: parsedData.data.type,
      userId: req.userId
    };

    if (parsedData.data.tags && parsedData.data.tags.length > 0) {
      const tagPromises = parsedData.data.tags.map(async (tagTitle: string) => {
        let tag = await Tagmodel.findOne({ title: tagTitle });
        if (!tag) {
          tag = await Tagmodel.create({ title: tagTitle });
        }
        return tag._id;
      });
      const tagIds = await Promise.all(tagPromises);
      
      contentData.tags = [{
        tags: tagIds
      }];
    }

    const content = await Contentmodel.create(contentData);
    return res.json({
      contentId: content.id
    });
  }catch(e){
    console.log(e);
    res.status(411).json({
      error: "Something went wrong"
    })
  }
})

app.get("/content", middleware, async (req:Request, res:Response): Promise<any> => {
  const userId = req.userId;

  const content = await Contentmodel.find({
    userId: userId 
  }).populate("userId","email");

  return res.json({
    content
  })
})

app.delete("/content", middleware, async (req:Request, res:Response): Promise<any> => {
  const contentId = req.body.contentId;

  const content = await Contentmodel.findOne({
    _id: contentId
  })
  if(!content){
    return res.json({
      error: "Content not found"
    })
  }
  await Contentmodel.deleteOne({
    _id: contentId,
    userId: req.userId
  })
  return res.json({
    message: "Content deleted"
  })
})

app.post("/brain/share", middleware, async (req:Request, res:Response): Promise<any> => {
  const {share} = req.body;
  if(share){
    const existingLink = await Linkmodel.findOne({
      userId: req.userId  
    })
    if(existingLink){
      return res.json({
        link: existingLink.hash
      })
    }
    const hash = randomBytes(10).toString("hex");
    const newLink = await Linkmodel.create({
      hash,
      userId: req.userId
    })
    return res.json({
    link: newLink.hash
  })
  } else {
    await Linkmodel.deleteOne({
      userId: req.userId
    })
    return res.json({
      message: "Link deleted"
    })
  }
})

app.get("/brain/:shareLink", async (req:Request, res:Response): Promise<any> => {
  const hash = req.params.shareLink;
  const link = await Linkmodel.findOne({
    hash
  })
  if(!link){
    return res.status(411).json({
      error: "Link not found"
    })
  }
  const content = await Contentmodel.find({
    userId: link.userId
  })
  const user = await Usermodel.findOne({
    _id: link.userId
  })
  
  if(!user){
    return res.status(411).json({
      error: "User not found"
    })
  }
    res.json({
    username: user.name,
    content
  })
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
