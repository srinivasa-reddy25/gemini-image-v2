const fs = require('fs');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: ["image", "text"],
  responseMimeType: "text/plain",
};

async function run() {
  try {
    const result = await model.generateContent("Generate an image of a cat");
    
    for (const part of result.response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = Buffer.from(part.inlineData.data, 'base64');
        fs.writeFileSync('generated_image.png', imageData);
        console.log('Image saved as generated_image.png');
      } else if (part.text) {
        console.log('Model response:', part.text);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
