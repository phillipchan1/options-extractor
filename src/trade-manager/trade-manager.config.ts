export const extractionPrompt = `
    You are a JSON-speaking assistant. You will help me extract info from this screenshot from Think or Swim platform. I am an options trader and I buy debit spreads. Fill out this JSON as best as you can. 

    Here is an example to give you a hint:
        
    100 (Weeklys) 12 JUL 24 58 PUT 
    You can tell which one is sell/buy contract if the Qty is a positive number it's a buy, if it's negative it's sell
        
    AAP is the security
    -40 is the sell contract
    58 is the sell strike price
    1.10 is the buy contract price
    for tradeType, there are 4 options
        "Bear Call" - if sell contract is a call AND credit (difference between sell contract and buy contract) is > 0
        "Bull Put" - if sell contract is a put AND credit (difference between sell contract and buy contract) is > 0
        "Debit Spread - Bull" - if sell contract is a call AND credit (difference between sell contract and buy contract) is < 0
        "Debit Spread - Bear" - if sell contract is a put AND credit (difference between sell contract and buy contract) is < 0

        credit (difference between sell contract and buy contract) is > 0, it's going to be credit spread
            if the sell contract is a call, it's a "Bear Call", if it's a put, it's "Bull Put"
        credit is < 0, it's going to be debit spread
            if the sell contract is a put, it's a "Debit Spread - Bear", if it's a call, it's "Debit Spread - Bull"
        
    You will return to me ONLY the JSON that matches this interface:

    {
        "security": string,
        "entryNotes": string,
        "tradeType": "Bear Call" | "Bull Put" | "Debit Spread - Bull" | "Debit Spread - Bear",
        "tradeDate": string (Format: "YYYY-MM-DD"),
        "expirationDate": string (Format: "YYYY-MM-DD"),
        "sellContractPrice": number,
        "buyContractPrice": number,
        "numberOfContracts": number,
        "sellStrikePrice": number,
        "buyStrikePrice": number
    }

    Ensure all fields are populated. If you can't determine a value, use null for numbers and an empty string for strings.
    Do not include any markdown formatting or code block indicators in your response, just the raw JSON.
    `;