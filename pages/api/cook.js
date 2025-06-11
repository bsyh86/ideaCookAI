const fs = require('fs').promises;
const {
    readState,
    writeState,
    synthesizeIdeas
} = require('../../utils/helpers');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Read state
        const state = await readState();
        
        if (!state.relevant_docs || state.relevant_docs.length === 0) {
            return res.status(400).json({
                error: 'No relevant documents found. Please run the ingredients step first.'
            });
        }

        // Read all relevant documents
        const documents = await Promise.all(
            state.relevant_docs.map(async (docPath) => {
                const content = await fs.readFile(docPath, 'utf-8');
                return content;
            })
        );

        // Synthesize ideas
        const cookedIdeas = await synthesizeIdeas(documents.join('\n\n---\n\n'));

        // Update state
        await writeState({
            ...state,
            cooked_ideas: cookedIdeas
        });

        return res.status(200).json({
            success: true,
            message: 'Successfully cooked ideas! Ready to serve.',
            cookedIdeas
        });

    } catch (error) {
        console.error('Error in cook endpoint:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
} 