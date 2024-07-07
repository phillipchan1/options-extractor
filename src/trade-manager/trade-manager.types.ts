interface TradeEntry {
    security: string;
    entryNotes: string;
    tradeType: "Debit Spread - Bull" | "Debit Spread - Bear";
    tradeDate: string; // Format: "YYYY-MM-DD"
    expirationDate: string; // Format: "YYYY-MM-DD"
    sellContractPrice: number;
    buyContractPrice: number;
    numberOfContracts: number;
    sellStrikePrice: number;
    buyStrikePrice: number;
}

export { TradeEntry }