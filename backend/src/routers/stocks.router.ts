import {Router} from 'express';
import { sample_stocks } from '../data';
import expressAsyncHandler from 'express-async-handler';
import { StockModel } from '../models/stocks.model';
const router = Router();

router.get("/seed", expressAsyncHandler( 
    async (req,res ) => {
    const stocksCount = await StockModel.countDocuments();
    if(stocksCount > 0){
        res.send("Seed done");
        return;
    }
    await StockModel.create(sample_stocks);
    res.send("Seed is done now");
}
));

router.get("/",expressAsyncHandler(async(req, res) => {
    const stocks=await StockModel.find();
    res.send(stocks);
}
));

router.get("/search/:searchTerm", expressAsyncHandler(async(req, res) => {
    const searchRegex=new RegExp(req.params.searchTerm,'i');
    const stocks=await StockModel.find({name:{ $regex: searchRegex }});
    res.send(stocks);
}
));

router.get("/:id",expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const stock = await StockModel.findById(id);
    res.send(stock);
}
));

export default router;