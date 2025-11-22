import { GoogleGenerativeAI } from '@google-ai/generativelanguage';

// Initialize the Gemini Pro model
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY); // Store your API key in an environment variable (see step 4)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function generateText(prompt) {
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const responseText = result.response.candidates[0].content.parts[0].text;
    return responseText;
  } catch (error) {
    console.error('Error generating text:', error);
    return null;
  }
}

export { generateText };