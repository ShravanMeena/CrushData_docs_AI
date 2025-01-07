const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pinecone } = require("@pinecone-database/pinecone");
const content = require("../dummy/data"); // Make sure content is a long string
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const indexName = process.env.PINECONE_API_INDEX_NAME;
const EMBEDDING_DIMENSION = 768;

/**
 * Helper Function: Split Long Content into Smaller Chunks
 * Each chunk will be around 1000 characters (can be adjusted based on token limits)
 */
const splitIntoChunks = (text, chunkSize = 2000) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
};

/**
 * Step 1: Create a Pinecone Index (Fixed Check for Existing Index)
 */
const createIndexIfNotExists = async () => {
    try {
        console.log("✅ Checking if the Pinecone index exists...");
        const existingIndexes = await pineconeClient.listIndexes();
        const indexNames = existingIndexes.indexes.map(index => index?.name);
        
        if (!indexNames.includes(indexName)) {
            console.log("⏳ Creating a new Pinecone index...");
            await pineconeClient.createIndex({
                name: indexName,
                dimension: EMBEDDING_DIMENSION, 
                metric: 'cosine',
                spec: { serverless: { cloud: 'aws', region: 'us-east-1' } }
            });
            console.log(`✅ Index '${indexName}' created successfully.`);
        } else {
            console.log(`✅ Index '${indexName}' already exists.`);
        }
    } catch (error) {
        console.error("❌ Error creating Pinecone index:", error.message);
    }
};

/**
 * Step 2: Generate Embeddings with Gemini for a Given Text Chunk
 */
const generateEmbeddings = async (text) => {
    try {
        console.log("⏳ Generating embeddings using Gemini for a chunk...");
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

        const embeddingResponse = await model.embedContent({
            content: { parts: [{ text }] }
        });
        return embeddingResponse.embedding.values;
    } catch (error) {
        console.error("❌ Error generating embeddings:", error.message);
        throw error;
    }
};

/**
 * Step 3: Store Embeddings in Pinecone (Handles Multiple Chunks)
 */
const storeEmbeddingsInPinecone = async (embeddings, chunks) => {
    try {
        const index = pineconeClient.Index(indexName);
        console.log("⏳ Storing multiple embeddings in Pinecone...");

        const upsertData = embeddings.map((embedding, idx) => ({
            id: `data-${Date.now()}-${idx}`,
            values: embedding,
            metadata: { text: chunks[idx] }
        }));

        await index.upsert(upsertData);
        console.log(`✅ Successfully stored ${chunks.length} chunks in Pinecone!`);
    } catch (error) {
        console.error("❌ Error storing embeddings in Pinecone:", error.message);
        throw error;
    }
};

/**
 * Step 4: Run the Entire Process with Chunking and Batch Handling
 */
const runProcess = async () => {
    try {
        console.log("🚀 Starting the Gemini + Pinecone Integration Process...");

        // Step 1: Create Index (if necessary)
        await createIndexIfNotExists();

        // Step 2: Split Content into Chunks
        const chunks = splitIntoChunks(content);
        console.log(`✅ Content split into ${chunks.length} chunks.`);

        // Step 3: Generate Embeddings for Each Chunk
        const embeddings = [];
        for (const chunk of chunks) {
            const embedding = await generateEmbeddings(chunk);
            embeddings.push(embedding);
        }

        // Step 4: Store the Embeddings with Corresponding Chunks
        await storeEmbeddingsInPinecone(embeddings, chunks);

        console.log("🎉 Process completed successfully with chunked content!");
    } catch (error) {
        console.error("❌ Process failed:", error.message);
    }
};

// Run the process
runProcess();