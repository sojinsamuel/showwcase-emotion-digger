# Showwcase Emotion Digger Bot

The Showwcase Emotion Digger bot is an automated Node.js bot that fetches the latest threads from Showwcase and performs emotion analysis on the messages. Based on the emotion detected, it stores the relevant information in Airtable. This bot is designed to work in conjunction with the [Mood Mention](https://github.com/sojinsamuel/Mood-Mentions) web application.

## Technologies Used

- Node.js
- Airtable
- OpenAI API

## Prerequisites

Before running the bot, ensure you have the following:

- Node.js installed on your machine
- Showwcase API key
- Airtable API key
- OpenAI API key

## Setup

1. Clone the repository:

```
git clone https://github.com/sojinsamuel/showwcase-emotion-digger-bot.git
```

2. Navigate to the project directory:

```
cd showwcase-emotion-digger-bot
```

3. Install the dependencies:

```
npm install
```

4. Set up environment variables:

- Create a `.env` file in the root of the project.
- Define the following environment variables in the file:

```plaintext
SHOWWCASE_API_KEY=YOUR_SHOWWCASE_API_KEY
AIRTABLE_API_KEY=YOUR_AIRTABLE_API_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

- Replace `YOUR_SHOWWCASE_API_KEY`, `YOUR_AIRTABLE_API_KEY`, and `YOUR_OPENAI_API_KEY` with your respective API keys.

5. Run the bot:

```
node bot.js
```

The bot will start fetching threads from Showwcase and performing emotion analysis on the messages. The relevant information will be stored in Airtable.
