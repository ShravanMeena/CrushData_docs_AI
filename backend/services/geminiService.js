const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pinecone } = require("@pinecone-database/pinecone");
const dotenv = require("dotenv");
const crustExpert = require("../dummy/crustExpert");
const astro = require("../dummy/astro");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const indexName = process.env.PINECONE_API_INDEX_NAME;

/**
 * ✅ Generate a Human-Like Response Using Crustdata API Knowledge Base
 * @param {string} message - The user's query
 * @param {Array} history - The user's chat history for context
 * @returns {string} - AI-generated response
 */
const generateResponse = async (message, history = []) => {
  try {
    console.log(
      "🔍 Searching for the most relevant Crustdata API information..."
    );

    const index = pineconeClient.Index(indexName);

    // ✅ Convert User Query to Embeddings Using Gemini
    const embeddingModel = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
    const embeddingResponse = await embeddingModel.embedContent({
      content: { parts: [{ text: message }] },
    });

    if (!embeddingResponse || !embeddingResponse.embedding) {
      console.error("❌ Error: Embedding generation failed.");
      return "**⚠️ Failed to generate embeddings for your query. Please try again later.**";
    }

    const embedding = embeddingResponse.embedding.values;

    // ✅ Perform a Vector Search in Pinecone
    const queryResults = await index.query({
      vector: embedding,
      topK: 10,
      includeMetadata: true,
    });

    // ✅ Validate Pinecone Response
    if (!queryResults || !queryResults.matches) {
      console.error("❌ Error: Pinecone query returned an invalid response.");
      return "**⚠️ Error retrieving information from the database. Please try again.**";
    }

    // ✅ Handle No Matches
    if (queryResults.matches.length === 0) {
      return `**🤖 I couldn't find specific information related to your query in our documentation. Could you clarify your question or provide more details?**`;
    }

    // ✅ Prepare Context for Gemini with Clear Instructions
    const matchedTexts = queryResults.matches
      .map((match) => match.metadata.text)
      .join("\n\n");

    let prompt = `

       
     ${crustExpert}

      **📖 Knowledge Base:**  
      ${matchedTexts}

      **📌 User's Query:**  
      ${message}

      **💡 Chat History:**  
      ${history.map((item) => `${item.role}: ${item.message}`).join("\n")}

      **Provide a clear, professional response with code examples where applicable.**
      `;

    // ✅ Special Handling for Casual Greetings
    if (["hey", "hello","Hi"].includes(message.toLowerCase().trim())) {
      prompt = `You are a friendly AI assistant. The user greeted you with "${message}". Respond politely and engage casually while staying professional.`;
    }

    // ✅ Generate the Gemini Response Using the Enhanced Prompt
    const chatModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await chatModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    if (!result || !result.response) {
      console.error("❌ Error: Gemini API did not return a valid response.");
      return "**⚠️ Failed to generate a response. Please try again later.**";
    }

    let finalResponse = result.response.text();

    // ✅ Validate API Call Example in Response (if present)
    if (finalResponse.includes("curl") || finalResponse.includes("fetch") ||  finalResponse.includes("bash")) {
      try {
        console.log("✅ Validating API call...");
        const apiTestResult = await validateApiCall(finalResponse);
        if (!apiTestResult.success) {
          finalResponse +=
            "\n\n**⚠️ Note:** The API call mentioned above could not be validated. Please review the API endpoint before using.";
        }
      } catch (error) {
        console.warn("⚠️ Error while validating API call:", error.message);
      }
    }

    // ✅ Return the Clear, Contextual Response
    return finalResponse;
  } catch (error) {
    console.error("❌ Error generating response:", error.message);
    return "**⚠️ I'm facing an issue processing your request. Please try again later.**";
  }
};

/**
 * ✅ API Call Validator (Simulates API Request Validation)
 * @param {string} responseText - The generated response text containing an API request.
 * @returns {Promise<{success: boolean, message: string}>}
 */
const validateApiCall = async (responseText) => {
  const apiUrlMatch = responseText.match(/https?:\/\/[^\s]+/);

  console.log(apiUrlMatch, "apiUrlMatchapiUrlMatch");

  if (!apiUrlMatch) {
    return {
      success: false,
      message: "No valid API endpoint found in the response.",
    };
  }

  const apiUrl = apiUrlMatch[0];
  try {
    const testResponse = await fetch(apiUrl);
    if (testResponse.ok) {
      return { success: true, message: "API endpoint is valid." };
    } else {
      return {
        success: false,
        message: `API returned error: ${testResponse.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error during API validation: ${error.message}`,
    };
  }
};

/**
 * ✅ Generate a Chat Title Based on Message and Response (No Pinecone Usage)
 * @param {string} message - User's message
 * @param {string} response - Bot's response
 * @returns {Promise<string>} - AI-generated title for the chat
 */
const generateTitle = async (message, response) => {
  try {
    const titlePrompt = `
        Generate a short, concise title for the following conversation:
        - User Message: "${message}"
        - Bot Response: "${response}"
        
        The title should be 3-5 words long and summarize the topic discussed.
        `;

    const titleModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await titleModel.generateContent({
      contents: [{ role: "user", parts: [{ text: titlePrompt }] }],
    });

    const generatedTitle = result.response.text();
    return generatedTitle.trim();
  } catch (error) {
    console.error("❌ Error generating chat title:", error.message);
    return "New Chat";
  }
};

module.exports = { generateResponse, generateTitle };
