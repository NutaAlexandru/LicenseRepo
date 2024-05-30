import {Router} from 'express';
import expressAsyncHandler from 'express-async-handler';
import { StockModel } from '../models/stocks.model';
import https from 'https';
const router = Router();

const apikey='79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI';

router.get('/stock-market-gainers', (req, res) => {
    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        path: `/api/v3/stock_market/gainers?apikey=${apikey}`,
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

router.get('/stock-market-losers', (req, res) => {
    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        path: `/api/v3/stock_market/losers?apikey=${apikey}`,
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

router.get('/stock-market-actives', (req, res) => {
    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        path: `/api/v3/stock_market/actives?apikey=${apikey}`,
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
                // Filtrăm doar obiectele care sunt de tipul 'stock'
                const filteredStockData = stockData.filter((item: any) => item.type === 'stock' && item.exchangeShortName === 'NASDAQ');
                const limitedStockData = filteredStockData.slice(0, 400); // Limităm la primele 400 de înregistrări
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

router.get('/favorites', async (req, res) => {
    try {
        const favorites = await StockModel.find({ favorite: true });
        res.send(favorites);
    } catch (error) {
        console.error('Error fetching favorite stocks:', error);
        res.status(500).send(error);
    }
});

router.put('/toggle-favorite/:id', async (req, res) => {
    const stockId = req.params.id;
    console.log('stockId:', stockId);
    try {
        // Căutăm stocul pentru a obține starea curentă a 'favorite'
        const stock = await StockModel.findById(stockId);
        if (!stock) {
            return res.status(404).send('Stock not found');
        }

        // Toggle starea de 'favorite'
        const updatedStock = await StockModel.findByIdAndUpdate(stockId, {
            $set: { favorite: !stock.favorite }
        }, { new: true }); // Asigurăm că răspunsul include documentul actualizat

        res.send(updatedStock);
    } catch (error) {
        console.error('Error updating favorite status:', error);
        res.status(500).send(error);
    }
});

router.get('/historical/:symbol', (req, res) => {
    const { symbol } = req.params;
    const from = req.query.from || '2022-03-17'; 
    const to = req.query.to || getTodayDateString();
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
            const parsedData = JSON.parse(data);
            if (Array.isArray(parsedData)) {
                res.json(parsedData.reverse()); // Inversează ordinea datelor înainte de a trimite răspunsul
            } else {
                res.json(parsedData); // Trimite răspunsul așa cum este dacă nu este un array
            }
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
    const apiKey = '79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI';
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
    const apiKey = '79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI';
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

router.get('/stock-price-change/:symbol', (req, res) => {
    const symbol = req.params.symbol;
    const apiKey = '79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI'; // Înlocuiește YOUR_API_KEY cu cheia ta reală
    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        path: `/api/v3/stock-price-change/${symbol}?apikey=${apiKey}`,
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

// router.get('/stock-price/:symbol', (req, res) => {
//     const symbol = req.params.symbol;
//     const apiKey = '79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI'; // Înlocuiește YOUR_API_KEY cu cheia ta reală
//     const options = {
//         hostname: 'financialmodelingprep.com',
//         port: 443,
//         path: `/api/v3/quote-short/${symbol}?apikey=${apiKey}`,
//         method: 'GET'
//     };

//     const request = https.request(options, response => {
//         let data = '';

//         response.on('data', chunk => {
//             data += chunk;
//         });

//         response.on('end', () => {
//             try {
//                 const parsedData = JSON.parse(data);
//                 const price=parsedData.price;
//                 res.json(price);
//             } catch (error) {
//                 console.error('Error parsing JSON:', error);
//                 res.status(500).send('An error occurred');
//             }
//         });
//     });

//     request.on('error', error => {
//         console.error('Error with the request:', error);
//         res.status(500).send('An error occurred');
//     });

//     request.end();
// });


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