import express, { Request, Response } from 'express';
import multer from 'multer';
import * as dotenv from 'dotenv';
import { addTradeToDatabase } from './trade-manager/trade-manager';
import { TradeEntry } from './trade-manager/trade-manager.types';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post(
  '/insert-option',
  upload.single('textFile'),
  async (req: Request, res: Response) => {
    const newTrade: TradeEntry = {
      security: "AAPL",
      entryNotes: "Bullish on earnings report",
      tradeType: "Debit Spread - Bull",
      tradeDate: "2024-07-15",
      expirationDate: "2024-08-19",
      sellContractPrice: 2.50,
      buyContractPrice: 1.75,
      numberOfContracts: 5,
      sellStrikePrice: 180,
      buyStrikePrice: 185
    };

    const notionDatabaseId = process.env.NOTION_DATABASE_ID;
    if (notionDatabaseId) {
      addTradeToDatabase(notionDatabaseId, newTrade);
      res.send("You got it");
    } else {
      console.error("Notion database ID is undefined.");
      res.send("Notion database ID is undefined.");
    }
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
