import { notion } from "../services/notion";
import { client } from "../services/openai";
import { TradeEntry } from "./trade-manager.types";
import { extractionPrompt } from "./trade-manager.config";
import { formatDate, validateObjectShape } from "../utils/utils";
import { uploadToAzureBlob } from "../services/azure-blob-storage";

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
            },
            "Trade Date": {
                date: { start: trade.tradeDate }
            }
        };

        if (trade.tradingPlan) {
            properties["Trading Plan"] = {
                rich_text: [{ text: { content: trade.tradingPlan } }]
            };
        }

        const expirationDate = formatDate(trade.expirationDate);
        if (expirationDate) {
            properties["Expiration Date"] = { date: { start: expirationDate } };
        }

        if (trade.screenshot) {
            const screenshotUrl = await uploadToAzureBlob(trade.screenshot, "screenshot.png");
            properties["Screenshot"] = {
                type: "files",
                files: [
                    {
                        type: "external",
                        name: "screenshot.png",
                        external: {
                            url: screenshotUrl
                        }
                    }
                ]
            };
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
                setTradeType(parsedContent);

                const isValidTradeEntry = validateObjectShape<TradeEntry>(parsedContent, {
                    security: 'string',
                    entryNotes: 'string',
                    tradeType: ['Debit Spread - Bull', 'Debit Spread - Bear', 'Bear Call', 'Bull Put'],
                    tradeDate: 'string',
                    expirationDate: 'string',
                    optionType: ['CALL', 'PUT'],
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

function setTradeType(trade: TradeEntry) {
    if (trade.sellContractPrice < trade.buyContractPrice) {
        console.log("Debit Spread");
        if (trade.optionType === "CALL") {
            trade.tradeType = "Debit Spread - Bull";
        } else {
            trade.tradeType = "Debit Spread - Bear";
        }
    } else {
        console.log("Credit Spread");
        if (trade.optionType === "CALL") {
            trade.tradeType = "Bear Call";
        } else {
            trade.tradeType = "Bull Put";
        }
    }
}

export { addTradeToDatabase, extractTradeFromImage }