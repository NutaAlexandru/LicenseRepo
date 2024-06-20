import { Router } from "express";

import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { DemoUser, DemoUserModel, User, UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '878958543895-jvesiqudtoi4iaf3kfjjaaipqh51b164.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const router = Router();

router.post("/login",expressAsyncHandler(async (req, res) => {
    const {email,password}=req.body;
    const user=await UserModel.findOne({email});

    if(user&& (await bcrypt.compare(password,user.password))){
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
        audience: CLIENT_ID, 
    });
    const payload:any = ticket.getPayload();
    console.log(payload);
    const user=await UserModel.findOne({email:payload.email});
    if (!user) {
      const newUser = new UserModel({
          id:'',
          email: payload.email.toLowerCase(),
          name: payload.name,
          isDemo: false,
        });
        const createdUser=await UserModel.create(newUser);
        res.send(generateToken(createdUser));
      }
      else res.send(generateToken(user));
});

router.put('/update-user/:userId', expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { address } = req.body;

        const tempUser = await UserModel.findById(userId);
        if (!tempUser) {
             res.status(404).send({ message: 'User not found' });
             return;
        }
        tempUser.address = address;
        const updatedUser = await tempUser.save();
        res.send(generateToken(updatedUser));
}));

router.get('/return-user/:userId', expressAsyncHandler( async (req,res ) =>{
    const { userId }=req.params;
    console.log(userId);
    const tempUser=await UserModel.findOne({_id:userId});
    if (!tempUser) {
        res.status(404).send({ message: 'User not found' });
        return;
    }
    res.send(generateToken(tempUser));
}));

router.post("/register",expressAsyncHandler(async (req, res) => {
    const {email,password,name,address}=req.body;
    var temp=0;
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
        isDemo:false,
        balance:temp
    }
    const createdUser=await UserModel.create(newUser);
    res.send(generateToken(createdUser));
}));

router.post('/switch-to-real', expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    let demoUser = await DemoUserModel.findOne({ email });
    
    if (!demoUser) {
      // Dacă utilizatorul nu este găsit, trimite un mesaj de eroare
      res.status(404).send({ message: 'User not found' });
      return;
    }
  
    let user = await UserModel.findOne({ email });
    
    if (user) {
    res.send(generateDemoToken(user));
    }
  }));

router.post('/switch-to-demo', expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
  
    // Caută utilizatorul în `UserModel`
    let user = await UserModel.findOne({ email });
    
    if (!user) {
      // Dacă utilizatorul nu este găsit, trimite un mesaj de eroare
      res.status(404).send({ message: 'User not found' });
      return;
    }
  
    // Caută contul demo în `DemoUserModel`
    let demoUser = await DemoUserModel.findOne({ email });
    
    if (!demoUser) {
      // Dacă contul demo nu este găsit, creează unul nou
      demoUser = new DemoUserModel({
        id:'',
        email: user.email,
        name: user.name,
        address: user.address,
        isDemo: true,
        balance: 99999999,
      });
      await demoUser.save();
    }
  
    // Trimite tokenul generat pentru contul demo
    res.send(generateDemoToken(demoUser));
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
        isDemo: user.isDemo,
        balance:user.balance,
        token: token
      };
}
const generateDemoToken = (demoUser: DemoUser) => {
    const token = jwt.sign({
      id: demoUser.id, email: demoUser.email
    }, 'secret', {
      expiresIn: "200d"
    });
    return {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      address: demoUser.address,
      isDemo: demoUser.isDemo,
      balance: demoUser.balance,
      token: token
    };
  }



export default router;