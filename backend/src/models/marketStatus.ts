import { Schema, model } from 'mongoose';

export interface MarketStatus {
  market_type: string;
  region: string;
  primary_exchanges: string;
  local_open: string;
  local_close: string;
  current_status: string;
  notes: string;
}

const MarketStatusSchema = new Schema<MarketStatus>({
  market_type: { type: String, required: true },
  region: { type: String, required: true },
  primary_exchanges: { type: String, required: true },
  local_open: { type: String, required: true },
  local_close: { type: String, required: true },
  current_status: { type: String, required: true },
  notes: { type: String, required: false },
},
  {
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
});

export const MarketStatusModel = model<MarketStatus>('MarketStatus', MarketStatusSchema);
