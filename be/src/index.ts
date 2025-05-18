import express, { Request, Response } from "express";
import { middleware } from "./middleware";
import { JWT_SECRET } from "./config";
import { Usermodel,Linkmodel,Contentmodel,Tagmodel } from "./db";
import cors from "cors";
import bcrypt from "bcrypt";
import { SignupSchema,SigninSchema,ContentSchema } from "./types";
import jwt from "jsonwebtoken";
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





app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
