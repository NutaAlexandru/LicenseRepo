import express from "express";
import cors from "cors";
import { sample_stocks } from "./data";

const app=express();

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

const port = 5000;
app.listen(port, () => {
    console.log("Server is running on http://localhost:"+port);
});

