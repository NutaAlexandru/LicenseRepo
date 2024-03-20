import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { User, UserModel, GoogleUserModel } from "../models/user.model";
import bcrypt from "bcryptjs";

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '878958543895-jvesiqudtoi4iaf3kfjjaaipqh51b164.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const router = Router();

router.get("/seed", expressAsyncHandler( 
    async (req,res ) => {
    const stocksCount = await UserModel.countDocuments();
    if(stocksCount > 0){
        res.send("Seed done");
        return;
    }
    await UserModel.create(sample_users);
    res.send("Seed is done now");
}
));

router.post("/login",expressAsyncHandler(async (req, res) => {
    const {email,password}=req.body;
    const user=await UserModel.findOne({email,password});

    if(user){
        res.send(generateToken(user));
    }
    else {
        res.status(401).send({message:"Invalid email or password"});
    }
}));

router.post('/google/login', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Verifică că ID token-ul este destinat aplicației tale
    });
    const payload:any = ticket.getPayload();
    console.log(payload);
    const user=await UserModel.findOne({email:payload.email});
    if (!user) {
      const newUser = new UserModel({
          id:'',
          email: payload.email.toLowerCase(),
          name: payload.name,
        });
        const createdUser=await UserModel.create(newUser);
        res.send(generateToken(createdUser));
      }
      else res.send(generateToken(user));
});


router.post("/register",expressAsyncHandler(async (req, res) => {
    const {email,password,name,address}=req.body;
    const user=await UserModel.findOne({email});
    if(user){
        res.status(401).send({message:"User already exists"});
        return;
    }

    const encryptedPassword=await bcrypt.hash(password,10);

    const newUser:User={
        id:'',
        name,
        email:email.toLowerCase(),
        password:encryptedPassword,
        address,
        isAdmin:false,
    }
    const createdUser=await UserModel.create(newUser);
    res.send(generateToken(createdUser));
}));


const generateToken=(user:User)=>{
    const token=jwt.sign({
        id: user.id,email:user.email
    },'secret',{
        expiresIn:"200d"
    });
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token: token
      };
}

async function verifyToken(token:string) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Verifică că ID token-ul este destinat aplicației tale
    });
    const payload = ticket.getPayload(); // Conține informații despre utilizatorul Google

    let user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      user = new UserModel({
        id:'',
        email: payload.email.toLowerCase(),
        name: payload.username,
      });
      await user.save();
    }
    const userToken = generateToken(user);
  
    return { user, token: userToken };   
  }
  
 

export default router;