const {
    readDocuments,
    readState,
    analyzeDocument,
    extractAuthor
} = require('../../utils/helpers');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Read all documents
        const allDocuments = await readDocuments();
        
        // Classify each document
        const documentsWithClassification = await Promise.all(
            allDocuments.map(async (doc) => {
                try {
                    const classification = await analyzeDocument(doc.content);
                    const author = extractAuthor(doc.content);
                    
                    return {
                        filename: doc.filename,
                        content: doc.content,
                        author: author || 'Unknown',
                        classification: classification || 'UNKNOWN'
                    };
                } catch (error) {
                    console.error(`Error classifying ${doc.filename}:`, error);
                    return {
                        filename: doc.filename,
                        content: doc.content,
                        author: extractAuthor(doc.content) || 'Unknown',
                        classification: 'ERROR'
                    };
                }
            })
        );

        return res.status(200).json({
            success: true,
            documents: documentsWithClassification
        });

    } catch (error) {
        console.error('Error in documents endpoint:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
} 