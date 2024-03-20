import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { CryptoModel } from '../models/crypto.model'; // Asumăm că ai un model definit pentru criptomonede
import https from 'https';

const router = Router();

router.get("/seed", expressAsyncHandler(async (req, res) => {
    const cryptosCount = await CryptoModel.countDocuments();
    if (cryptosCount > 0) {
        res.send("Seed already done. Cryptos present in the database.");
        return;
    }

    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        path: '/api/v3/symbol/available-cryptocurrencies?apikey=79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI', // Înlocuiește YOUR_API_KEY cu cheia ta reală
        method: 'GET'
    };

    https.get(options, (apiRes) => {
        let rawData = '';

        apiRes.on('data', (chunk) => {
            rawData += chunk;
        });

        apiRes.on('end', async () => {
            try {
                const cryptoData = JSON.parse(rawData);
                const limitedStockData = cryptoData.slice(0, 100); // Limitați la primele 100 de înregistrări
                
                await CryptoModel.create(limitedStockData);
                res.send("Seed is done now. Cryptos have been added to the database.");
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
    const from = req.query.from || '2023-08-10'; // Exemplu de valoare implicită pentru 'from'
    const to = req.query.to || getTodayDateString(); // Folosește funcția pentru a obține data de azi ca valoare implicită pentru 'to'
    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
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

router.get("/",expressAsyncHandler(async(req, res) => {
    const crypto=await CryptoModel.find();
    res.send(crypto);
}
));

router.get("/crypto/search/:searchTerm", expressAsyncHandler(async(req, res) => {
    const searchRegex=new RegExp('^' + req.params.searchTerm, 'i');
    const crypto=await CryptoModel.find({symbol:{ $regex: searchRegex }});
    res.send(crypto);
}
));

router.get("/:id",expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const crypto = await CryptoModel.findById(id);
    res.send(crypto);
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
