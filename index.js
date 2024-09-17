const express = require('express');
const OpenAI = require('openai');
const ngrok = require('ngrok');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to interact with ChatGPT API using OpenAI Node SDK
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ error: 'Prompt is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // You can change this to 'gpt-3.5-turbo' if needed
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch response from ChatGPT' });
  }
});

// Start the server
app.listen(port, async () => {
  console.log(`Server listening on http://localhost:${port}`);

  // Expose the server using ngrok
  const url = await ngrok.connect({
    addr: port,
    authtoken: process.env.NGROK_AUTH_TOKEN,
  });
  console.log(`Ngrok tunnel available at: ${url}`);
});
