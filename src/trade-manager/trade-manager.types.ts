export interface TradeEntry {
    security: string;
    entryNotes: string;
    tradeType: "Debit Spread - Bull" | "Debit Spread - Bear";
    tradeDate: string;
    expirationDate: string;
    sellContractPrice: number;
    buyContractPrice: number;
    numberOfContracts: number;
    sellStrikePrice: number;
    buyStrikePrice: number;
    tradingPlan?: string;
    screenshot?: Buffer;
}