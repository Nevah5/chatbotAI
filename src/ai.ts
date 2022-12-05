import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const main = async (prompt: string) => {
  const response = await openai.createCompletion({
    model: "text-babbage-001",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 350,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response;
};

export default main;
