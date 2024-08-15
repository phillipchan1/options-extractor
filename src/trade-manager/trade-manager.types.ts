export interface TradeEntry {
    security: string;
    entryNotes: string;
    tradeType: "Debit Spread - Bull" | "Debit Spread - Bear" | "Bear Call" | "Bull Put";
    tradeDate: string;
    expirationDate: string;
    sellContractPrice: number;
    buyContractPrice: number;
    optionType: "CALL" | "PUT";
    numberOfContracts: number;
    sellStrikePrice: number;
    buyStrikePrice: number;
    tradingPlan?: string;
    screenshot?: Buffer;
}