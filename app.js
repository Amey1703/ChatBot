/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import dotenv from "dotenv";
import readLineSync from "readline-sync";
import colors from "colors";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// async function run() {
//   const chatSession = model.startChat({
//     generationConfig,
//     // safetySettings: Adjust safety settings
//     // See https://ai.google.dev/gemini-api/docs/safety-settings
//     history: [],
//   });

//   const result = await chatSession.sendMessage("Who won copa america 2020?");
//   console.log(result.response.text());
// }

async function main() {
  console.log(colors.bold.cyan("Welcome to the Chatbot Program!"));
  console.log(colors.bold.cyan("You can start chatting with the bot."));

    const chatHistory = [];
  while (true) {
    const userInput = readLineSync.question(colors.magenta("You: "));
    try {
        // Constructing text by iterating history
        const texts = chatHistory.map(([role, parts]) => ({
            role,
            parts: parts.map(part => ({text: part}))
        }))

        texts.push({role:'user', parts:[{text:userInput}]})

      const chatSession = model.startChat({
        generationConfig,
        history: texts,
      });

      const result = await chatSession.sendMessage(userInput);
      const completionText = result.response.text();
      if (userInput.toLowerCase() === "exit") {
        console.log(colors.yellow("Bot: ") + result.response.text());
        return;
      }

      console.log(colors.yellow("Bot: ") + result.response.text());
      chatHistory.push(["user", [userInput]]);
      chatHistory.push(["model", [completionText]]);
    } catch (error) {
      console.error(colors.red(error));
    }
  }
}

// run();
main();
