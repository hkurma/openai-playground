# OpenAI Playground Plus

Playground app for OpenAI API's and more. Use your own OpenAI API Key. Your API Key is stored and used only from your browser.

[Playground Plus App](https://openai-playground-plus-immineal.vercel.app)

## API's

These OpenAI API's are currently supported in the playground.

- Text Generation
- Text Completion
- Vision
- Audio Transcription
- Image Generation
- Assistants
- Moderations

[OpenAI API Reference](https://platform.openai.com/docs/api-reference)

[OpenAI Docs](https://platform.openai.com/docs/overview)

## Tokenizer

Tool to help you understand how text is tokenized by a model and the total count of tokens.

Tokenizer uses [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) npm package, which is a port of OpenAI's [tiktoken](https://github.com/openai/tiktoken).

# Run locally

Follow these steps to run the app locally.

- Install dependencies

```bash
npm install
```

- Start development server

```bash
npm run dev
```

You can access the app on http://localhost:3000

# Build

Run the following script to build the app.

```bash
npm run build
```
