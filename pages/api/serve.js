const fs = require('fs').promises;
const path = require('path');
const {
    readState,
    readSpicePoints,
    writeSpicePoints,
    appendToFile,
    scoreDocument,
    extractAuthor
} = require('../../utils/helpers');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Read state
        const state = await readState();
        
        if (!state.relevant_docs || !state.cooked_ideas) {
            return res.status(400).json({
                error: 'Missing required data. Please run the ingredients and cook steps first.'
            });
        }

        // Read spice points
        const spicePoints = await readSpicePoints();
        const scoringResults = [];

        // Process each relevant document
        for (const docPath of state.relevant_docs) {
            const content = await fs.readFile(docPath, 'utf-8');
            
            // Append cooked ideas
            await appendToFile(docPath, `\n\nCooked Ideas:\n${state.cooked_ideas}`);

            // Score document
            const score = await scoreDocument(content);
            const author = extractAuthor(content);

            if (author) {
                spicePoints[author] = (spicePoints[author] || 0) + score;
                scoringResults.push({ author, score });
            }
        }

        // Update spice points
        await writeSpicePoints(spicePoints);

        // Clean up state file
        await fs.unlink(path.join(process.cwd(), 'tmp', '_state.json'));

        return res.status(200).json({
            success: true,
            message: 'Successfully served ideas and updated scores!',
            scoringResults,
            spicePoints
        });

    } catch (error) {
        console.error('Error in serve endpoint:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
} 