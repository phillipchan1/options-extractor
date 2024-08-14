export const extractionPrompt = `
    You are a JSON-speaking assistant. You will help me extract info from this screenshot from Think or Swim platform. I am an options trader and I buy debit spreads. Fill out this JSON as best as you can. 

    Here is an example to give you a hint:
        
    | Instrument                        | Qty  | Days | Trade Price |
    |-----------------------------------|------|------|-------------|
    | LULU                              |      |      | .00         |
    | Lululemon Athletica               | 0    |      |             |
    | 100 (Weeklys) 23 AUG 24 255 CALL  | -10  | 10   | 2.07        |
    | 100 (Weeklys) 23 AUG 24 257.5 CALL| +10  | 10   | 1.58        |

        You will return to me ONLY the JSON that matches this interface:

    {
        "security": string,
        "entryNotes": string,
        "tradeType": "Bear Call" | "Bull Put",
        "tradeDate": string (Format: "YYYY-MM-DD"),
        "expirationDate": string (Format: "YYYY-MM-DD"),
        "sellContractPrice": number,
        "buyContractPrice": number,
        "numberOfContracts": number,
        "sellStrikePrice": number,
        "buyStrikePrice": number
    }
        
    LULU is the security
    -10 is the sell contract (will always be a negative number, 10 contracts)
    +10 is the buy contract (will always be a positive number, 10 contracts)
    255 is the sell strike price
    257.5 is the buy strike price
    2.07 is the sell contract price
    1.10 is the buy contract price

    for tradeType, here is logic to determine the trade type:
        if (sellContractPrice - buyContractPrice) > 0 && sell contract is a call, then it is a "Bear Call"
        if (sellContractPrice - buyContractPrice) > 0 && sell contract is a put, then it is a "Bull Put"

    for expirationDate, it is the date of the contract expiration. for your reference today is ${new Date().toISOString().split('T')[0]}

        

    Ensure all fields are populated. If you can't determine a value, use null for numbers and an empty string for strings.
    Do not include any markdown formatting or code block indicators in your response, just the raw JSON.
    `;