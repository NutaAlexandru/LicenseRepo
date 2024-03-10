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

// router.post('/google/login', async (req, res) => {
//     const { token } = req.body;
//     try {
//       const { user, token: userToken } = await verifyToken(token);
//       res.json({ user: user, token: userToken });
//     } catch (error) {
//       console.error("Error verifying Google token: ", error);
//       res.status(500).send("Internal Server Error");
//     }
//   });

router.post('/google/login', async (req, res) => {
    const { token } = req.body;
    try {
        const { user, token: userToken } = await verifyToken(token);
        // Presupunând că dorești să returnezi structura similară cu endpoint-ul `/login`
        // și că `user` include toate informațiile necesare
        res.json({
            _id: user._id, // Sau user.id, în funcție de cum este definit în schema ta
            email: user.email,
            name: user.name,
            token: userToken, // Acesta este token-ul de sesiune generat pentru utilizator
            // Orice alte câmpuri relevante pe care dorești să le returnezi
        });
    } catch (error) {
        console.error("Error verifying Google token: ", error);
        res.status(500).send("Internal Server Error");
    }
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
        isAdmin:false
    }
    const createdUser=await UserModel.create(newUser);
    res.send(generateToken(createdUser));
}));


const generateToken=(user:any)=>{
    const token=jwt.sign({
        email:user.email,isAdmin:user.isAdmin
    },'secret',{
        expiresIn:"200d"
    });
    user.token=token;
    return user;
}

async function verifyToken(token:string) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Verifică că ID token-ul este destinat aplicației tale
    });
    const payload = ticket.getPayload(); // Conține informații despre utilizatorul Google
  
    // Logica pentru a verifica dacă utilizatorul există în baza ta de date
    // Dacă nu, poți crea un nou utilizator folosind informațiile din payload
    let user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      // Dacă utilizatorul nu există, creează unul nou
      user = new UserModel({
        id:'',
        email: payload.email,
        name: payload.name,
        // Alte câmpuri necesare modelului tău de utilizator
      });
      await user.save();
    }
  
    // Generarea unui token de sesiune personalizat sau utilizarea unei metode existente
    const userToken = generateToken(user);
  
    return { user, token: userToken };
  }
  
 

export default router;