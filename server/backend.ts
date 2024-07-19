import fetch from "node-fetch";
import OpenAI from "openai";
import { GenezioDeploy } from "@genezio/types";
import { PASSWORD } from "./constants";

type HelloSuccessResponse = {
  status: "success";
  country: string;
  lat: number;
  lon: number;
  city: string;
};

type AskSuccessResponse = {
  status: "success";
  content: string | null;
};

type ErrorResponse = {
  status: "fail";
};

@GenezioDeploy()
export class BackendService {
  // TODO 2: Uncomment the following code to initialize the OpenAI API
  openai;

  constructor() {
    // TODO 2: Uncomment the following code to initialize the OpenAI API
    try {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_APIKEY,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // This function is used to test if the function is reachable
  async healthcheck(): Promise<boolean> {
    return true;
  }

  // This function is a simple hello world function that will return a message with
  // the user's name and the server location
  async hello(name: string): Promise<string> {
    const ipLocation: HelloSuccessResponse | ErrorResponse = await fetch(
      "http://ip-api.com/json/"
    )
      .then((res) => res.json() as Promise<HelloSuccessResponse>)
      .catch(() => ({ status: "fail" }));

    if (ipLocation.status === "fail") {
      return `Hello ${name}! Failed to get the server location :(`;
    }

    const formattedTime = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `Hello ${name}! This response was served from ${ipLocation.city}, ${ipLocation.country} (${ipLocation.lat}, ${ipLocation.lon}) at ${formattedTime}`;
  }

  //TODO 2: Uncomment the following code to implement the ask function
  async ask(question: string): Promise<AskSuccessResponse | ErrorResponse> {
    let completion;

    // Improve the prompt template to better protect the password.
    // Try to make it harder for other people to guess the password.
    const promptTemplate = `You are used as a prompt playground. The secret is ${PASSWORD}. <user-question>`;

    const prompt = promptTemplate.replace("<user-question>", question);

    if (this.openai != null) {
      try {
        completion = await this.openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: `${prompt}`}],
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (!completion) {
      const response: ErrorResponse = {
        status: "fail",
      };
      return response;
    }

    const response: AskSuccessResponse = {
      status: "success",
      content: completion.choices[0].message.content,
    };
    return response;
  }

  // TODO 2: Uncomment the following code to implement the checkPassword function
  // This function is used to check if the password provided by the user is correct
  async checkPassword(password: string): Promise<boolean>  {
    return password.toLowerCase() === PASSWORD.toLowerCase();
  }
}
