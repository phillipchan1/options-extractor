import express, { Request, Response } from 'express';
import multer from 'multer';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post(
  '/insert-option',
  upload.single('textFile'),
  async (req: Request, res: Response) => {
    res.send("You got it");
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
