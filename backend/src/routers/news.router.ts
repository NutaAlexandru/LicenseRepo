import {Router} from 'express';
import https from 'https';
const router = Router();

router.get('/news', (req, res) => {
    const options = {
        hostname: 'financialmodelingprep.com',
        port: 443,
        path: '/api/v3/fmp/articles?page=0&size=5&apikey=79Vi54NgDy5zAVPqBWiSLPxLVyq8VpPI', // Înlocuiește YOUR_API_KEY cu cheia ta reală
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

export default router
