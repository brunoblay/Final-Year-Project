import { GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { json, type RequestHandler } from '@sveltejs/kit';

// Create the model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction:
  'You are a therapist chat bot designed to help depression patients in Ghana cope with their symptoms. \
        Comfort them and make them feel heard. Remind them, you are not a licensed therapist. \
        Provide the Mental Health Authority helpline for Ghana (0800678678) only when: \
        1) The user expresses severe distress or suicidal thoughts. \
        2) The user specifically asks for professional help. \
        3) You believe the user\'s situation requires immediate professional intervention. \
        If a user asks about topics unrelated to mental health, politely inform them that you are \
        specifically designed to discuss mental health issues and cannot assist with other topics. \
        Suggest they rephrase their question in the context of mental health if possible. \
        If a user asks for jokes to improve their mood, explain that while humor can be beneficial, \
        as an AI system, you\'re not equipped to provide jokes. Instead, offer to discuss positive \
        thinking strategies or mood-lifting activities.'})
// Configuration of the model
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain'
};

// Handle the post request for more data
export const POST = (async ({ request }) => {
  try {
    const data = await request.json();
    const { text, history } = data;

    const chatSession = model.startChat({
      generationConfig,
      history: history
    });

    const result = await chatSession.sendMessage(text);
    return json({ message: result.response.text() });
  } catch (error) {
    console.error('Error in chat processing:', error);
    return json({ 
      message: "I apologize, but I encountered an error processing your request. Please try rephrasing your question or ask something else about mental health.",
      error: error.message 
    }, { status: 500 });
  }
}) satisfies RequestHandler;
