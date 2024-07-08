import express, { Request, Response } from 'express';
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
  upload.single('image'),
  async (req: express.Request, res: express.Response) => {
    try {
      if (!req.file) {
        return res.status(400).send("No image file uploaded");
      }

      const notionDatabaseId = process.env.NOTION_DATABASE_ID;
      if (!notionDatabaseId) {
        return res.status(500).send("Notion database ID is undefined.");
      }

      const trade = await extractTradeFromImage(req.file.buffer);

      await addTradeToDatabase(notionDatabaseId, trade);

      res.send("Trade added with image analysis");
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send("An error occurred while processing the request");
    }
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
