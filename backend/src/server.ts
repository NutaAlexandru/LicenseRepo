import dotenv from "dotenv";
dotenv.config();
process.env.MONGO_URI;

import express from "express";
import cors from "cors";
import { sample_stocks, sample_users } from "./data";
import jwt from "jsonwebtoken";
import stocksRouter from "./routers/stocks.router";
import userRouter from "./routers/user.router";
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



// 'use strict';
// var request = require('request');

// // replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
// var url = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=QTDCJI3NK5I0TKTL';

// request.get({
//     url: url,
//     json: true,
//     headers: {'User-Agent': 'request'}
//   }, (err:any, res:any, data:any) => {
//     if (err) {
//       console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//       console.log('Status:', res.statusCode);
//     } else {
//       // data is successfully parsed as a JSON object:
//       console.log(data);
//     }
// });

const port = 5000;
app.listen(port, () => {
    console.log("Server is running on http://localhost:"+port);
});

