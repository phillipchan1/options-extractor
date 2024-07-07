# BRD-AI

A tool for automatically generating Business Requirements Documents (BRDs) using advanced AI language models, such as OpenAI's GPT models.

## Key Features

- Generates comprehensive BRD sections, including:
  - Title Page
  - Document Information
  - Requirements
  - Business Policies

## Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/phillipchan1/brd-ai-middleware](https://github.com/phillipchan1/brd-ai-middleware)
   ```

2. **Install dependencies**

   ```bash
   cd brd-ai
   npm install
   ```

## Usage

Obtain OpenAI API Key

Go to the Azure resource to get the key

## Set Environment Variable

Create a .env file in the project's root directory.
Add the following line, replacing with your actual API key:
OPENAI_API_KEY=your_openai_api_key

## Start the server:

```Bash
npm run dev
Use code with caution.
```

Or for production builds:

Bash
npm run build
npm start
Use code with caution.

## Send a POST request:

```Bash
curl -X POST http://localhost:3000/brd \
     -H "Content-Type: application/json" \
     -d '{"projectBrief": "Your detailed project description here"}'
```

Replace "Your detailed project description here" with `projectBrief.json`

## Response

The server will respond with a Markdown-formatted BRD, ready for download.

## Dependencies

Node.js
Express
OpenAI
Typescript (for development)
See package.json for the full list.

## Contributing

We welcome contributions to BRD-AI! Please refer to our CONTRIBUTING.md file (feel free to create one) for guidelines on how to get involved.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

Let me know if you'd like any modifications or have any further details about your project that you would like included in the README!
