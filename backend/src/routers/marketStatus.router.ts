
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { sample_market } from "../data";
import { MarketStatusModel } from "../models/marketStatus";
import cron from "node-cron";
const router = express.Router();



router.get("/seed", expressAsyncHandler( 
    async (req,res ) => {
    const count = await MarketStatusModel.countDocuments();
    if(count > 0){
        res.send("Seed done");
        return;
    }
    await MarketStatusModel.create(sample_market);
    res.send("Seed is done now");
}
));

router.get('/market-status/:exchangeShortName', async (req, res) => {
    const { exchangeShortName } = req.params;

    try {
        const marketStatus = await MarketStatusModel.findOne({
            primary_exchanges: { $regex: new RegExp(`\\b${exchangeShortName}\\b`, 'i') }
        });

        if (!marketStatus) {
            return res.status(404).json({ message: 'Market status not found' });
        }

        const isOpen = marketStatus.current_status === 'open';
        return res.status(200).json({ isOpen });
    } catch (error:any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

export const updateMarketStatus = async () => {
    try {
      const markets = await MarketStatusModel.find();
      const currentTime = getCurrentTime();
  
      for (const market of markets) {
        const { local_open, local_close, region, current_status } = market;
  
        // Convertire timp local în timp UTC
        const localOpenTime = new Date(`1970-01-01T${local_open}:00`);
        const localCloseTime = new Date(`1970-01-01T${local_close}:00`);
        const now = new Date();
  
        // Schimbă ora locală în UTC
        const openTime = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          localOpenTime.getUTCHours(),
          localOpenTime.getUTCMinutes()
        ));
  
        const closeTime = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          localCloseTime.getUTCHours(),
          localCloseTime.getUTCMinutes()
        ));
  
        if (now >= openTime && now <= closeTime && current_status === 'closed') {
          market.current_status = 'open';
          await market.save();
          console.log(`Market in ${region} is now open`);
        } else if ((now < openTime || now > closeTime) && current_status === 'open') {
          market.current_status = 'closed';
          await market.save();
          console.log(`Market in ${region} is now closed`);
        }
      }
    } catch (error) {
      console.error('Error updating market status:', error);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  cron.schedule('*/5 * * * *', async () => {
    console.log('Running market status update job...');
    await updateMarketStatus();
});
export default router;