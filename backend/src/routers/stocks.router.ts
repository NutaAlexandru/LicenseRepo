import {Router} from 'express';
import { sample_stocks } from '../data';
import expressAsyncHandler from 'express-async-handler';
import { StockModel } from '../models/stocks.model';
import https from 'https';
const router = Router();

// router.get("/seed", expressAsyncHandler( 
//     async (req,res ) => {
//     const stocksCount = await StockModel.countDocuments();
//     if(stocksCount > 0){
//         res.send("Seed done");
//         return;
//     }
//     await StockModel.create(sample_stocks);
//     res.send("Seed is done now");
// }
// ));

router.get("/seed", expressAsyncHandler(async (req, res) => {
    const stocksCount = await StockModel.countDocuments();
    if (stocksCount > 0) {
        res.send("Seed already done. Stocks present in the database.");
        return;
    }

    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        path: '/api/v3/stock/list?apikey=79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI', // Înlocuiți cu cheia dvs. API reală
        method: 'GET'
    };

    https.get(options, (apiRes) => {
        let rawData = '';

        apiRes.on('data', (chunk) => {
            rawData += chunk;
        });

        apiRes.on('end', async () => {
            try {
                const stockData = JSON.parse(rawData);
                const limitedStockData = stockData.slice(0, 100); // Limitați la primele 100 de înregistrări
                await StockModel.create(limitedStockData);
                // Procesați aici datele conform modelului dvs., dacă este necesar
                //await StockModel.create(stockData); // Presupunând că `stockData` este în formatul acceptat de modelul dvs.
                res.send("Seed is done now. Stocks have been added to the database.");
            } catch (error) {
                console.error(error);
                res.status(500).send("Error seeding the database.");
            }
        });
    }).on('error', (error) => {
        console.error('Error calling the API:', error);
        res.status(500).send("Error calling the API.");
    });
}));

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


// const options: https.RequestOptions = {
//     hostname: 'financialmodelingprep.com',
//     port: 443,
//     path: '/api/v3/stock/list?apikey=79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI', // Aici am eliminat 'https://' deoarece în contextul opțiunilor, este nevoie doar de calea (path) specifică resursei
//     method: 'GET'
// };

// const req = https.request(options, (res) => {
//     let rawData = '';

//     res.on('data', (d: Buffer) => {
//         rawData += d.toString();
//     });

//     res.on('end', () => {
//         console.log(rawData); // Acum puteți, de asemenea, să procesați sau să analizați datele cum doriți
//     });
// });

// req.on('error', (error: Error) => {
//     console.error(error);
// });

// req.end();
export default router;