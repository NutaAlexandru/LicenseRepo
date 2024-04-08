import dotenv from "dotenv";
dotenv.config();
process.env.MONGO_URI;

import express from "express";
import cors from "cors";
import stocksRouter from "./routers/stocks.router";
import userRouter from "./routers/user.router";
import newsRouter from "./routers/news.router" 
import dividentsRouter from "./routers/dividents.router"
import cryptoRouter from "./routers/crypto.router"
import transactionsRouter from "./routers/transactions.router"
import { dbConnect } from "./configs/database.config";
dbConnect();
const app=express();
app.use(express.json());
app.use(cors(
    {
        credentials: true,
        origin: "http://localhost:4200",
        optionsSuccessStatus: 200
    }
));
app.post('/google/login', (req, res) => {
    console.log(req.body);
    res.redirect('http://localhost:4200');
});

app.use("/api/stocks",stocksRouter);
app.use("/api/users",userRouter);
app.use("/api",newsRouter);
app.use('/api',dividentsRouter);
app.use('/api/cryptos',cryptoRouter);
app.use('/api/transactions',transactionsRouter);

const port = 5000;
app.listen(port, () => {
    console.log("Server is running on http://localhost:"+port);
});

