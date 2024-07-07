import { notion } from "../services/notion";
import { TradeEntry } from "./trade-manager.types";

async function addTradeToDatabase(databaseId: string, trade: TradeEntry) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                "Security": {
                    rich_text: [{ text: { content: trade.security } }]
                },
                "Entry Notes": {
                    title: [{ text: { content: trade.entryNotes } }]
                },
                "Trade Type": {
                    select: { name: trade.tradeType }
                },
                "Trade Date": {
                    date: { start: trade.tradeDate }
                },
                "Expiration Date": {
                    date: { start: trade.expirationDate }
                },
                "Sell Contract Price": {
                    number: trade.sellContractPrice
                },
                "Buy Contract Price": {
                    number: trade.buyContractPrice
                },
                "No. Of Contracts": {
                    number: trade.numberOfContracts
                },
                "Sell Strike Price": {
                    number: trade.sellStrikePrice
                },
                "Buy Strike Price": {
                    number: trade.buyStrikePrice
                }
            }
        });

        console.log("Success! Trade added to database.");
        return response;
    } catch (error) {
        console.error("Error adding trade to database:", error);
    }
}

export { addTradeToDatabase }