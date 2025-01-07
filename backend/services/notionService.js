const { Client } = require("@notionhq/client");
const dotenv = require('dotenv');

dotenv.config();

// Initialize the Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * Fetch all blocks from a Notion page.
 * @param {string} pageId - The Notion page ID
 */
const fetchNotionData = async (pageId) => {
    try {
        const response = await notion.blocks.children.list({
            block_id: pageId,
            page_size: 100
        });

        // Extract plain text from Notion blocks
        const content = response.results
            .map((block) => block[block.type]?.rich_text?.[0]?.plain_text || "")
            .filter(Boolean)
            .join(" ");
        
        return content;
    } catch (error) {
        console.error("Error fetching Notion data:", error);
        throw new Error("Failed to retrieve Notion data.");
    }
};

module.exports = { fetchNotionData };