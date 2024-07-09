import express from 'express';
import multer from 'multer';
import * as dotenv from 'dotenv';
import { addTradeToDatabase, extractTradeFromImage } from './trade-manager/trade-manager';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post(
  '/insert-option',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'screenshot', maxCount: 1 }]),
  async (req: express.Request, res: express.Response) => {
    try {
      const notionDatabaseId = process.env.NOTION_DATABASE_ID;
      if (!notionDatabaseId) {
        return res.status(500).send("Notion database ID is undefined.");
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFile = files['image'] ? files['image'][0] : null;
      const screenshotFile = files['screenshot'] ? files['screenshot'][0] : null;

      if (!imageFile) {
        return res.status(400).send("No image file uploaded");
      }

      let trade = await extractTradeFromImage(imageFile.buffer);

      if (req.body.tradingPlan) trade.tradingPlan = req.body.tradingPlan;
      if (req.body.entryNotes) trade.entryNotes = req.body.entryNotes;

      trade.tradeDate = new Date().toISOString().split('T')[0];

      if (screenshotFile) {
        trade.screenshot = screenshotFile.buffer;
      }

      await addTradeToDatabase(notionDatabaseId, trade);

      res.send("Trade added to database!");
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send("An error occurred while processing the request");
    }
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});