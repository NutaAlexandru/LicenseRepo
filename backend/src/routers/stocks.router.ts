import {Router} from 'express';
import expressAsyncHandler from 'express-async-handler';
import { StockModel } from '../models/stocks.model';
import https from 'https';
const router = Router();

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
                const limitedStockData = stockData.slice(0, 400); // Limitați la primele 100 de înregistrări
                await StockModel.create(limitedStockData);
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

router.get('/historical/:symbol', (req, res) => {
    const { symbol } = req.params;
    // Folosește valori implicite pentru 'from' și 'to' dacă nu sunt specificate
    const from = req.query.from || '2023-03-17'; // Exemplu de valoare implicită pentru 'from'
    const to = req.query.to || getTodayDateString(); // Folosește funcția pentru a obține data de azi ca valoare implicită pentru 'to'
    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        //path: `/api/v3/historical-chart/4hour/${stockSymbol}?from=${from}&to=${to}&apikey=79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI`,
        path: `/api/v3/historical-chart/4hour/${symbol}?from=${from}&to=${to}&apikey=79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI`,
        method: 'GET'
    };
    
    const request = https.request(options, response => {
        let data = '';
        
        response.on('data', chunk => {
            data += chunk;
        });
        
        response.on('end', () => {
            res.json(JSON.parse(data));
        });
    });

    request.on('error', error => {
        console.error(error);
        res.status(500).send('An error occurred');
    });
    
    request.end();
});

router.get('/company-profile/:symbol', (req, res) => {
    const symbol = req.params.symbol;
    const apiKey = '79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI'; // Înlocuiește YOUR_API_KEY cu cheia ta reală
    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        path: `/api/v3/profile/${symbol}?apikey=${apiKey}`,
        method: 'GET'
    };

    const request = https.request(options, response => {
        let data = '';

        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const parsedData = JSON.parse(data);
                res.json(parsedData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.status(500).send('An error occurred');
            }
        });
    });

    request.on('error', error => {
        console.error('Error with the request:', error);
        res.status(500).send('An error occurred');
    });

    request.end();
});

router.get('/market-data/:symbol', (req, res) => {
    const symbol = req.params.symbol;
    const apiKey = '79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI'; // Înlocuiește YOUR_API_KEY cu cheia ta reală
    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        path: `/api/v3/stock/full/real-time-price/${symbol}?apikey=${apiKey}`,
        method: 'GET'
    };

    const request = https.request(options, response => {
        let data = '';

        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const parsedData = JSON.parse(data);
                res.json(parsedData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.status(500).send('An error occurred');
            }
        });
    });

    request.on('error', error => {
        console.error('Error with the request:', error);
        res.status(500).send('An error occurred');
    });

    request.end();
});

router.get("/",expressAsyncHandler(async(req, res) => {
    const stocks=await StockModel.find();
    res.send(stocks);
}
));

router.get("/search/:searchTerm", expressAsyncHandler(async(req, res) => {
    const searchRegex=new RegExp('^' + req.params.searchTerm, 'i');
    const stocks=await StockModel.find({symbol:{ $regex: searchRegex }});
    res.send(stocks);
}
));

router.get("/:id",expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const stock = await StockModel.findById(id);
    res.send(stock);
}
));

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default router;