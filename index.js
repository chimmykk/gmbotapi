const express = require("express");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/usegpt", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
        ${prompt}
        
        Marv says sarcastically,
   
      `,
      max_tokens: 64,
      temperature: 0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    });
    let responseData = response.data.choices[0].text.replace(/["']/g, "");
    return res.status(200).json({
      success: true,
      data: responseData.trim(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "There was an issue on the server",
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));