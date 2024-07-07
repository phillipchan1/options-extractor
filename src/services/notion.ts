import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
dotenv.config();

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})


export { notion }