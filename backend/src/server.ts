import express from "express";
import cors from "cors";
import { sample_stocks, sample_users } from "./data";
import jwt from "jsonwebtoken";

const app=express();
app.use(express.json());
app.use(cors(
    {
        credentials: true,
        origin: "http://localhost:4200",
        optionsSuccessStatus: 200
    }
));

app.get("/api/stocks", (req, res) => {
    res.send(sample_stocks);
});

app.get("/api/stocks/search/:searchTerm", (req, res) => {
    const searchTerm = req.params.searchTerm;
    const stocks = sample_stocks.filter(stock => stock.name.toLowerCase().includes(searchTerm.toLowerCase()));
    res.send(stocks);
});

app.get("/api/stocks/:id", (req, res) => {
    const id = req.params.id;
    const stock = sample_stocks.find(stock => stock.id === id);
    res.send(stock);
});

app.post("/api/users/login", (req, res) => {
    const {email,password}=req.body;
    const user=sample_users.find(user => user.email === email && user.password === password);

    if(user){
        res.send(generateToken(user));
    }
    else {
        res.status(401).send({message:"Invalid email or password"});
    }
});

const generateToken=(user:any)=>{
    const token=jwt.sign({
        email:user.email,isAdmin:user.isAdmin
    },'secret',{
        expiresIn:"200d"
    });
    user.token=token;
    return user;
}

const port = 5000;
app.listen(port, () => {
    console.log("Server is running on http://localhost:"+port);
});

