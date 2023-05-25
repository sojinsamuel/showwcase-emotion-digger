const Airtable = require("airtable");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

const apiKey = process.env.SHOWWCASE_API_KEY;

// Airtable configuration
const airtableApiKey = process.env.AIRTABLE_API_KEY;
const baseId = "appgdNuvoyvr4lJJe";
const tableName = "Showwcase24";
const base = new Airtable({ apiKey: airtableApiKey }).base(baseId);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function getThreads() {
  const url = "https://cache.showwcase.com/feeds/discover";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const feed = await response.json();
    return feed;
  } catch (error) {
    console.error("Error:", error.message);
    // Handle the error gracefully
    return null;
  }
}

async function processThread(thread) {
  const { id, title, message, user } = thread;

  // Count the number of words in the message
  const wordCount = message.split(" ").length;

  if (wordCount > 7) {
    // Generate AI response for emotion analysis
    const prompt = `What is the emotion of this message. Response must be in 1 word and only choose from these options [happy, sad, anIntroduction, anArticle] Message: "${title} ${message}."`;
    const aiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const responseContent = aiResponse.data.choices[0].message.content;
    const emotion = responseContent.toLowerCase().trim();

    console.log("Emotion analysis response:", emotion);
    console.log("Message:", message);

    let status;
    // Check for happy or sad moments
    if (emotion === "happy") {
      console.log("Happy moment!");
      status = "Happy";
    } else if (emotion === "sad") {
      console.log("Sad moment!");
      status = "Sad";
    }

    // Check if the record already exists in Airtable
    base(tableName)
      .select({
        filterByFormula: `{ThreadId} = '${id}'`, // Replace 'Thread ID' with the actual field name in your Airtable
        maxRecords: 1,
      })
      .firstPage((err, records) => {
        if (err) {
          console.error("Error fetching records from Airtable:", err);
          return;
        }

        if (records && records.length > 0) {
          console.log("Record already exists in Airtable. Skipping creation.");
        } else {
          // Create a new record in Airtable
          base(tableName).create(
            {
              Name: user.displayName,
              Notes: `${title} ${message}`,
              ImageLink: user.profilePictureUrl,
              Status: status,
              ThreadId: `${id}`, // Replace 'Thread ID' with the actual field name in your Airtable
            },
            (err, record) => {
              if (err) {
                console.error("Error creating record in Airtable:", err);
              } else {
                console.log("Record created successfully in Airtable:", record);
              }
            }
          );
        }
      });
  } else {
    console.log("Message:", message);
    console.log(
      "Message does not contain more than 7 words. Skipping creation."
    );
  }
}

// Usage example
getThreads()
  .then((feed) => {
    if (feed && feed.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < feed.length) {
          processThread(feed[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 1 * 60 * 1000); // Wait for 12 minutes between each iteration
    } else {
      console.log("No threads found in the Discover Feed.");
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
