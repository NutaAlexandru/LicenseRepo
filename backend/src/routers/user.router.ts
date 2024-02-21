import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";
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

const generateToken=(user:any)=>{
    const token=jwt.sign({
        email:user.email,isAdmin:user.isAdmin
    },'secret',{
        expiresIn:"200d"
    });
    user.token=token;
    return user;
}

export default router;