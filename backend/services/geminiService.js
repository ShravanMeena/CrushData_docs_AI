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
    const embedding = embeddingResponse.embedding.values;

    // ✅ Perform a Vector Search in Pinecone
    const queryResults = await index.query({
      vector: embedding,
      topK: 10,
      includeMetadata: true,
    });

    // ✅ Handle No Matches in the Database
    if (queryResults.matches.length === 0) {
      return `**🤖 I couldn't find specific information related to your query in our documentation. Could you clarify your question or provide more details?**`;
    }

    // ✅ Prepare Context for Gemini (More Engaging & Focused Prompt)
    const matchedTexts = queryResults.matches
      .map((match) => match.metadata.text)
      .join("\n\n");

    let prompt = `
       ${crustExpert}

        **📚 Here Knowledge Base:**  
        ${matchedTexts}

        **📌 User's Query:**  
        ${message}

        **💡 Chat History for Context:**  
        ${history.map((item) => `${item.role}: ${item.message}`).join("\n")}

        **✅ Key Instructions for Your Response:**  
        - **Use Bullet Points:** for step-by-step instructions.  
        - **Markdown Usage:** Format responses with proper headings, bullet points, and code blocks when providing code examples.  
        - **Stay Focused:** If the query is unrelated to docus, politely ask for clarification.  
        - and give if needed like example req,response,summary and this type of fileds so it can more readable
        **Now, provide a professional and human-like response based on the above knowledge.**
        `;

    // ✅ Special Handling for Casual Messages (Polite Engagement)
    if (
      message.toLowerCase().trim() === "hey" ||
      message.toLowerCase().trim() === "hello"
    ) {
      prompt = `You are a friendly AI assistant. The user greeted you with "${message}". Respond politely and engage casually, but keep it professional.`;
    }

    // ✅ Generate the Gemini Response Using the Enhanced Prompt
    const chatModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await chatModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let finalResponse = result.response.text();

    // ✅ Return the Clear, Contextual Response
    return finalResponse;
  } catch (error) {
    console.error("❌ Error generating response:", error.message);
    return "**⚠️ I'm facing an issue processing your request. Please try again later.**";
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
