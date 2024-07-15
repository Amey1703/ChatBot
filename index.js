import openai from "./config/open-ai.js";
import readLineSync from "readline-sync";
import colors from "colors";

async function main() {
  console.log(colors.bold.cyan("Welcome to the Chatbot Program!"));
  console.log(colors.bold.cyan("You can start chatting with the bot."));

  const chatHistory = [];

  while (true) {
    const userInput = readLineSync.question(colors.magenta("You: "));

    try {
      // Construct messages by iterating  history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      //   Add latest user input
      messages.push({ role: "user", content: userInput });

      // api call
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
      // get completionText
      const completionText = chatCompletion.choices[0].message.content;
      if (userInput.toLowerCase() === "exit") {
        console.log(colors.yellow("Bot: ") + completionText);

        return;
      }

      console.log(colors.yellow("Bot: ") + completionText);
      //   Update history with user and response
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", completionText]);
    } catch (error) {
      console.error(colors.red(error));
    }
  }
}

main();
