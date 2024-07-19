# Prompt hijacking playground - Genezio x WeAreDevelopers Workshop

This repository contains the source code for the workshop *"Keep your frontend and backend in sync"* held at [WeAreDeveloper 2024](https://www.wearedevelopers.com/).

This is a code along workshop - you will be able to deploy your own version of the project and try to guess the password of the other participants.

Do not hesitate to ask questions during the workshop, we will be happy to help you!

You can use your own IDE or use Gitpod, a free online IDE that will allow you to code along with us without having to install anything on your computer.

<div style="display: flex; align-items: center;">
  <a href="https://gitpod.io/#https://github.com/andreia-oca/wearedevelopers-workshop" style="margin-right: 10px;">
    <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod" style="height: 50px;"/>
  </a>
</div>

## Step-by-step tutorial

### 1.Deploy a hello world project

Install genezio in your preferred environment by running the following command:

```bash
npm install -g genezio
```

Login to genezio by running the command below.
A browser window will open, and you will be asked to log in with your GitHub account or Google account.

```bash
genezio login
```

Clone this repository and navigate to the project folder.

```bash
git clone https://github.com/andreia-oca/wearedevelopers-workshop.git
cd wearedevelopers-workshop
```

Right the project contains a simple hello world function. Deploy it and test it out.

Deploy the project by running the following command:

```bash
genezio deploy
```

The Genezio dashboard is available at the following URL: [https://app.genez.io](https://app.genez.io).

You can take a look to see information about your project:
- Check the `Logs` page to see the logs of your deployed functions.
- Test the backend API in the `Test Interface` page.

The dashboard is the main management interface for your project.
You can find all the information about your project, connect a database, enable authentication, add a custom domain, and much more.

### 2.Implement the backend service

Going back to your IDE, navigate to the `server` directory and open the `index.ts` file.

Uncomment the following methods: `ask()` and the `checkPassword()`.

Take a bit of time to understand the code and what each function does.

To be able to do calls to OpenAI, you need to create an account and get an API key. For this workshop we are providing you with an API key in this [spreadsheet](https://docs.google.com/spreadsheets/d/108QwmdheKLw8dP2HoN0Zjdo2kKyOnkSLK3hefvuiLrU/edit?usp=sharing
).

Create a file `server/.env` and add the OpenAI API key to it:

```bash
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXX
```

### 3.Test the backend functions

You can test the backend functions locally by running the following command in the root directory of the project:

```bash
genezio local
```

This command spawns a local server that you can use to test your project before deploying it again.

To test the backend API, open a browser page on [http://localhost:8083](http://localhost:8083) and use the `Test Interface` to call the `ask` and `checkPassword` functions.

### 4.Connect the frontend

Going back to your IDE, navigate to the `client` directory and open the `src/App.tsx` file.

Uncomment the methods `askCapy()` and `checkPassword()`.

Notice that the calls to the backend service are made using the generated SDK `genezio-sdk/wearedevelopers-workshop`.
This SDK makes all the exported types and methods from the backend service available in the frontend.

```typescript
const response = await BackendService.ask(question);
```

### 5.Deploy the project

You are now ready to deploy the fullstack project.

Run the following command in the root directory of the project:

```bash
genezio deploy --env server/.env
```

### 6.Play time

The purpose of each application is to design a prompt that will instruct the AI to protect the password at all cost.

Choose a password and write a prompt that will make the AI protect it.

Deploy your project and publish the URL in this [spreadsheet](https://docs.google.com/spreadsheets/d/108QwmdheKLw8dP2HoN0Zjdo2kKyOnkSLK3hefvuiLrU/edit?usp=sharing
).

Feel free to try out to guess other participants' passwords. Once you have guessed a password, please claim it in the spreadsheet for glory and fame! :rocket:

You can improve your prompt and redeploy as many times as you want. Encourage your left/right neighbors to guess your password!

### Advanced - Connect a database to be able to easily change the password/prompt

Right now both the password and the prompt are hardcoded in the backend service.
This is not ideal as you need to redeploy the service every time you want to change the password or the prompt.

To fix this, you can connect a database to the backend service and store the password and prompt in the database.

Install the `pg` package in the `server` directory:
```bash
npm install pg
```

Integrate the following code in the `server/index.ts` file to connect to a PostgreSQL database:
```typescript
import pg from 'pg'
const { Pool } = pg

pool = new Pool({
  // Use the environment variable to connect to the database
  connectionString: process.env["GETTING_STARTED_DATABASE_URL"],
  ssl: true,
});

async function savePrompt(prompt: string, password: string) {
  await this.pool.query(
    "CREATE TABLE IF NOT EXISTS prompt_playground (id serial PRIMARY KEY,prompt VARCHAR(255), password VARCHAR(255))"
  );

  await this.pool.query("INSERT INTO prompt_playground (prompt, password) VALUES ($1, $2)", [prompt, password]);

  const result = await this.pool.query("SELECT * FROM prompt_playground");

  return JSON.stringify(result.rows);
}
```

To create and host a Postgres database in Genezio, go to the `Database` page in the Genezio dashboard and follow the wizard. For simplicity you should name it `getting_started`. Otherwise, you should update the backend code to use the correct environment variable as a connection string.

### Advanced - Add a rate limiter to prevent spamming

To prevent spamming for the OpenAI calls, you can add a rate limiter to the backend service.

Simply add the decorator `@GenezioRateLimit` above the `ask` function in the `server/index.ts` file.

Install the rate limiter package in the `server` directory:
```bash
npm install @genezio/rate-limiter
```

```typescript
import { GenezioRateLimiter } from 'genezio-rate-limiter';

@GenezioRateLimiter({ dbUrl: process.env.UPSTASH_REDIS_URL, limit: 5 })
async ask(question: string): Promise<AskSuccessResponse | ErrorResponse> {
  // ...
}
```

Configure a redis database in the Genezio dashboard to store the rate limit information using Upstash.

You can test out the rate limiter by calling the `ask` function multiple times in a row in the `Test Interface` page.

### Advanced - Enable authentication to create a leaderboard

You can authenticate the players with email and password to be able to create a leaderboard.

Check this tutorial [Genezio documentation](https://genezio.com/docs/tutorials/create-react-app-genezio-auth/) to understand how to enable authentication in your Genezio project.

## Support

Feel free to ask questions during the workshop, we will be happy to help you!

If you encounter any issues outside the workshop, please leave a [GitHub issue] and we will get back to you as soon as possible.

## Resources

- https://genezio.com/docs/
- https://genezio.com
