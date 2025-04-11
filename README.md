# Image Generator using Stable Diffusion XL Base 1.0

This project is a simple image generator that utilizes the [Stable Diffusion XL Base 1.0](https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0) model from Hugging Face for AI-powered image generation.

## Features

- Generate images from text prompts.
- Uses Hugging Face API for inference.
- Lightweight and easy to use.
- Built with Node.js, Express, and EJS for frontend rendering.

## Requirements

Ensure you have the following installed:

- Node.js
- `dotenv`, `express`, `axios`, and `ejs` npm packages

Install dependencies using:

```bash
npm install express axios ejs dotenv
```

## Setup

1. Obtain an API key from [Hugging Face](https://huggingface.co/settings/tokens).
2. Create a `.env` file in the root directory and add your API key:
   ```
   HF_API_KEY=your_huggingface_api_key
   ```
3. Set up your server script (`server.js`):

## Usage

1. Run the server:
   ```bash
   node server.js
   ```
2. Open `http://localhost:3000` in your browser.
3. Enter a text prompt and generate images.

## Notes

- The API might have rate limits.
- Ensure your API key has the necessary permissions.
- For best results, experiment with different prompts.

## License

This project is under the MIT License.

