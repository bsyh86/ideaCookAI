const {
    readDocuments,
    writeState,
    analyzeDocument,
    generateFeedback,
    appendToFile
} = require('../../utils/helpers');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Read all documents
        const documents = await readDocuments();
        const stats = {
            total: documents.length,
            relevant: 0,
            vague: 0,
            irrelevant: 0
        };

        const relevantDocs = [];

        // Process each document
        for (const doc of documents) {
            const analysis = await analyzeDocument(doc.content);
            
            switch (analysis) {
                case 'RELEVANT':
                    stats.relevant++;
                    relevantDocs.push(doc.path);
                    break;
                case 'VAGUE':
                    stats.vague++;
                    const feedback = await generateFeedback(doc.content);
                    await appendToFile(doc.path, `\n\nFeedback: ${feedback}`);
                    break;
                case 'IRRELEVANT':
                    stats.irrelevant++;
                    break;
            }
        }

        // Save state
        await writeState({
            relevant_docs: relevantDocs,
            cooked_ideas: null
        });

        return res.status(200).json({
            success: true,
            message: `Success! ${stats.relevant} of ${stats.total} documents are relevant. Ready to COOK.`,
            stats
        });

    } catch (error) {
        console.error('Error in ingredients endpoint:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
} 