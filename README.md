# Trade Manager

## Overview

The Trade Manager is a Node.js application that allows users to upload option trade images and automatically extract trade details to store in a Notion database. The application leverages the OpenAI API for image processing and extraction of trade information, as well as Azure Blob Storage for storing screenshots.

## Features

- Upload option trade images and screenshots.
- Extract trade details from images using OpenAI's GPT-4.
- Store trade information in a Notion database.
- Store trade screenshots in Azure Blob Storage.

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- A Notion database
- Azure Blob Storage account
- OpenAI API key

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/trade-manager.git
    cd trade-manager
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the project and add the following environment variables:

    ```plaintext
    PORT=8000
    NOTION_DATABASE_ID=your_notion_database_id
    OPENAI_API_KEY=your_openai_api_key
    AZURE_STORAGE_ACCOUNT=your_azure_storage_account_name
    AZURE_STORAGE_ACCESS_KEY=your_azure_storage_access_key
    ```

4. Start the application:

    ```bash
    npm start
    ```

## Usage

The application exposes an endpoint to upload option trade images and screenshots. The extracted trade details are stored in a Notion database, and screenshots are stored in Azure Blob Storage.

### Endpoint

#### `POST /insert-option`

- **Description**: Upload an option trade image and an optional screenshot, and store the extracted trade details in a Notion database.

- **Request**:
    - Headers:
        - `Content-Type: multipart/form-data`
    - Body:
        - `image`: (required) The option trade image file.
        - `screenshot`: (optional) The screenshot file.
        - `tradingPlan`: (optional) The trading plan as a string.
        - `entryNotes`: (optional) The entry notes as a string.

- **Response**:
    - `200 OK`: Trade added to the database successfully.
    - `400 Bad Request`: No image file uploaded.
    - `500 Internal Server Error`: Error processing the request or Notion database ID is undefined.

## Code Overview

### `index.ts`

This file sets up the Express server and defines the `/insert-option` endpoint for uploading trade images and screenshots. It processes the request, extracts trade details using the `extractTradeFromImage` function, and adds the trade to the Notion database using the `addTradeToDatabase` function.

### `trade-manager/trade-manager.ts`

This file contains the core logic for extracting trade details from images and adding trade entries to the Notion database.

- `addTradeToDatabase(databaseId: string, trade: TradeEntry)`: Adds a trade entry to the specified Notion database.
- `extractTradeFromImage(imageBuffer: Buffer, maxRetries = 3)`: Extracts trade details from the provided image buffer using OpenAI's GPT-4.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.