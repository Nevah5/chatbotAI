import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const main = async (prompt) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.9,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
  });
  return response;
};

export default main;
