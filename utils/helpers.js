const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate API key
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please check your .env.local file.');
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// File system helpers
const DOCUMENTS_DIR = path.join(process.cwd(), 'data', 'documents');
const STATE_FILE = path.join(process.cwd(), 'tmp', '_state.json');
const SPICE_POINTS_FILE = path.join(process.cwd(), 'data', 'spice_points.txt');

async function readDocuments() {
    const files = await fs.readdir(DOCUMENTS_DIR);
    const documents = [];
    
    for (const file of files) {
        if (file.endsWith('.txt') || file.endsWith('.md')) {
            const content = await fs.readFile(path.join(DOCUMENTS_DIR, file), 'utf-8');
            documents.push({
                filename: file,
                content,
                path: path.join(DOCUMENTS_DIR, file)
            });
        }
    }
    
    return documents;
}

async function appendToFile(filePath, content) {
    const existingContent = await fs.readFile(filePath, 'utf-8');
    await fs.writeFile(filePath, `${existingContent}\n\n${content}`);
}

async function readState() {
    try {
        const state = await fs.readFile(STATE_FILE, 'utf-8');
        return JSON.parse(state);
    } catch (error) {
        return { relevant_docs: [], cooked_ideas: null };
    }
}

async function writeState(state) {
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

async function readSpicePoints() {
    try {
        const points = await fs.readFile(SPICE_POINTS_FILE, 'utf-8');
        return JSON.parse(points);
    } catch (error) {
        return {};
    }
}

async function writeSpicePoints(points) {
    await fs.writeFile(SPICE_POINTS_FILE, JSON.stringify(points, null, 2));
}

// Gemini API helpers
async function analyzeDocument(content) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const prompt = `System: You are a document analyst. Determine if the following text is a 'relevant' idea, 'vague', or 'irrelevant'. A relevant idea is concrete and actionable towards POS system matters, with clear outcome, goals, next steps. A vague one has potential but lacks detail to impact, outcome, goals, next steps. irrelevant would be for totally unrelated to POS system matters . Your response should be a single word: RELEVANT, VAGUE, or IRRELEVANT. Document: ${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
}

async function generateFeedback(content) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const prompt = `System: You are a helpful coach. The following idea is too vague. Provide short, constructive feedback (2-3 sentences) on how to make it more concrete. Idea: ${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
}

async function synthesizeIdeas(ideas) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const prompt = `System: You are a strategic facilitator. The following are several ideas from different team members. Synthesize them into a single, coherent block of text. Identify synergies, suggest collaborative next steps, and formulate overarching themes. Do not simply summarize. Create a new, actionable plan. Ideas: ${ideas}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
}

async function scoreDocument(content) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const prompt = `System: You are a document scorer. Based on its potential impact and relevance, assign a 'spicy' rating from 1 (low impact) to 5 (high impact) to the following document. Your response must be a single number. Document: ${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseInt(response.text().trim());
}

function extractAuthor(content) {
    const authorMatch = content.match(/Author:\s*([^\n]+)/);
    return authorMatch ? authorMatch[1].trim() : null;
}

module.exports = {
    readDocuments,
    appendToFile,
    readState,
    writeState,
    readSpicePoints,
    writeSpicePoints,
    analyzeDocument,
    generateFeedback,
    synthesizeIdeas,
    scoreDocument,
    extractAuthor
}; 