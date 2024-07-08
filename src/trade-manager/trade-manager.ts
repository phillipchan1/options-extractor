import { notion } from "../services/notion";
import { client } from "../services/openai";
import { TradeEntry } from "./trade-manager.types";
import { extractionPrompt } from "./trade-manager.config";
import { formatDate, validateObjectShape } from "../utils/utils";

async function addTradeToDatabase(databaseId: string, trade: TradeEntry) {
    try {
        const properties: any = {
            "Security": {
                rich_text: [{ text: { content: trade.security || '' } }]
            },
            "Entry Notes": {
                title: [{ text: { content: trade.entryNotes || '' } }]
            },
            "Trade Type": {
                select: { name: trade.tradeType || '' }
            },
            "Sell Contract Price": {
                number: trade.sellContractPrice || null
            },
            "Buy Contract Price": {
                number: trade.buyContractPrice || null
            },
            "No. Of Contracts": {
                number: trade.numberOfContracts || null
            },
            "Sell Strike Price": {
                number: trade.sellStrikePrice || null
            },
            "Buy Strike Price": {
                number: trade.buyStrikePrice || null
            }
        };

        const tradeDate = formatDate(trade.tradeDate);
        if (tradeDate) {
            properties["Trade Date"] = { date: { start: tradeDate } };
        }

        const expirationDate = formatDate(trade.expirationDate);
        if (expirationDate) {
            properties["Expiration Date"] = { date: { start: expirationDate } };
        }

        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: properties
        });

        console.log("Success! Trade added to database.");
        return response;
    } catch (error) {
        console.error("Error adding trade to database:", error);
        throw error;
    }
}

async function extractTradeFromImage(imageBuffer: Buffer, maxRetries = 3): Promise<TradeEntry> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await client.chat.completions.create({
                model: "gpt-4-32k",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: extractionPrompt },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/png;base64,${imageBuffer.toString('base64')}`,
                                },
                            },
                        ],
                    },
                ],
            });

            const content = response.choices[0].message.content;
            if (!content) {
                throw new Error("Empty response from OpenAI");
            }

            const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();

            try {
                const parsedContent = JSON.parse(jsonContent);

                const isValidTradeEntry = validateObjectShape<TradeEntry>(parsedContent, {
                    security: 'string',
                    entryNotes: 'string',
                    tradeType: ['Debit Spread - Bull', 'Debit Spread - Bear'],
                    tradeDate: 'string',
                    expirationDate: 'string',
                    sellContractPrice: 'number',
                    buyContractPrice: 'number',
                    numberOfContracts: 'number',
                    sellStrikePrice: 'number',
                    buyStrikePrice: 'number'
                });

                if (!isValidTradeEntry) {
                    throw new Error("Invalid TradeEntry structure");
                }

                return parsedContent;
            } catch (parseError) {
                console.error(`Attempt ${attempt + 1}: Failed to parse JSON:`, parseError);
                if (attempt === maxRetries - 1) {
                    throw parseError;
                }
            }
        } catch (error) {
            console.error(`Attempt ${attempt + 1}: Error analyzing image:`, error);
            if (attempt === maxRetries - 1) {
                throw error;
            }
        }
    }

    throw new Error(`Failed to extract trade information after ${maxRetries} attempts`);
}

export { addTradeToDatabase, extractTradeFromImage }