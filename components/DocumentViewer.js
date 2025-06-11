import { useState } from 'react';

export default function DocumentViewer({ documents, cookedIdeas }) {
  const [activeTab, setActiveTab] = useState(null);

  if (!documents && !cookedIdeas) return null;

  const groupedDocs = documents ? {
    relevant: documents.filter(doc => doc.classification === 'RELEVANT'),
    vague: documents.filter(doc => doc.classification === 'VAGUE'),
    irrelevant: documents.filter(doc => doc.classification === 'IRRELEVANT')
  } : {};

  // Parse document content to separate original content from AI-generated content
  const parseDocumentContent = (content) => {
    const parts = content.split('\n\nCooked Ideas:\n');
    return {
      originalContent: parts[0],
      aiContent: parts[1] || null
    };
  };

  const renderDocuments = (docs) => (
    <div className="documents-list">
      {docs.map((doc, index) => {
        const { originalContent, aiContent } = parseDocumentContent(doc.content);
        return (
          <div key={index} className="document-card">
            <div className="doc-header">
              <div className="doc-title-section">
                <h4>{doc.filename}</h4>
                <span className="classification-badge">{doc.classification}</span>
              </div>
              <span className="author-badge">{doc.author}</span>
            </div>
            
            <div className="doc-content">
              <div className="original-content">
                <h5 className="content-label">📄 Original Document</h5>
                <div className="content-text">
                  {originalContent}
                </div>
              </div>
              
              {aiContent && (
                <div className="ai-content">
                  <h5 className="content-label ai-label">🤖 AI-Generated Ideas</h5>
                  <div className="ai-content-text">
                    {aiContent}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCookedIdeas = () => (
    <div className="cooked-content">
      <div className="cooked-header">
        <h3>🍳 Synthesized Ideas</h3>
        <p className="cooked-subtitle">AI-generated collaborative insights from relevant documents</p>
      </div>
      <div className="cooked-text">
        <div className="content-text">
          {cookedIdeas}
        </div>
      </div>
    </div>
  );

  return (
    <div className="document-viewer">
      <div className="viewer-controls">
        {documents && (
          <>
            <button 
              className={`tab-btn relevant ${activeTab === 'relevant' ? 'active' : ''}`}
              onClick={() => setActiveTab(activeTab === 'relevant' ? null : 'relevant')}
            >
              ✅ Relevant ({groupedDocs.relevant?.length || 0})
            </button>
            <button 
              className={`tab-btn vague ${activeTab === 'vague' ? 'active' : ''}`}
              onClick={() => setActiveTab(activeTab === 'vague' ? null : 'vague')}
            >
              ⚠️ Vague ({groupedDocs.vague?.length || 0})
            </button>
            <button 
              className={`tab-btn irrelevant ${activeTab === 'irrelevant' ? 'active' : ''}`}
              onClick={() => setActiveTab(activeTab === 'irrelevant' ? null : 'irrelevant')}
            >
              ❌ Irrelevant ({groupedDocs.irrelevant?.length || 0})
            </button>
          </>
        )}
        {cookedIdeas && (
          <button 
            className={`tab-btn cooked ${activeTab === 'cooked' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'cooked' ? null : 'cooked')}
          >
            🍳 Cooked Ideas
          </button>
        )}
      </div>

      {activeTab && documents && activeTab !== 'cooked' && (
        <div className="content-panel">
          <h3 className="panel-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Documents
          </h3>
          {renderDocuments(groupedDocs[activeTab])}
        </div>
      )}

      {activeTab === 'cooked' && cookedIdeas && (
        <div className="content-panel">
          {renderCookedIdeas()}
        </div>
      )}

      <style jsx>{`
        .document-viewer {
          max-width: 1200px;
          margin: 2rem auto;
        }

        .viewer-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .tab-btn {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid transparent;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .tab-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .tab-btn.active {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .tab-btn.relevant.active {
          background: #f0fff4;
          border-color: #48bb78;
          color: #22543d;
        }

        .tab-btn.vague.active {
          background: #fffaf0;
          border-color: #ed8936;
          color: #7b341e;
        }

        .tab-btn.irrelevant.active {
          background: #f8f9fa;
          border-color: #a0aec0;
          color: #2d3748;
        }

        .tab-btn.cooked.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #5a67d8;
        }

        .content-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideIn 0.3s ease-out;
        }

        .panel-title {
          text-align: center;
          margin-bottom: 2rem;
          color: #2d3748;
          font-size: 1.5rem;
        }

        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .document-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 2.5rem;
          margin-bottom: 1rem;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .document-card:hover {
          border-color: #cbd5e0;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .doc-title-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .doc-header h4 {
          margin: 0;
          color: #2d3748;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .classification-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          align-self: flex-start;
        }

        .author-badge {
          background: #f7fafc;
          color: #4a5568;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          border: 2px solid #e2e8f0;
        }

        .doc-content {
          text-align: left;
        }

        .original-content {
          margin-bottom: 2rem;
        }

        .content-label {
          color: #4a5568;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ai-label {
          color: #667eea;
        }

        .content-text {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e9ecef;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #2d3748;
          line-height: 1.7;
          font-size: 0.95rem;
          text-align: left;
          max-height: 400px;
          overflow-y: auto;
        }

        .ai-content {
          border-top: 3px solid #667eea;
          padding-top: 1.5rem;
        }

        .ai-content-text {
          background: linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%);
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #c3d9ff;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #2d3748;
          line-height: 1.7;
          font-size: 0.95rem;
          text-align: left;
          max-height: 400px;
          overflow-y: auto;
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.1);
        }

        .cooked-content {
          text-align: left;
        }

        .cooked-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .cooked-header h3 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
          font-size: 1.8rem;
        }

        .cooked-subtitle {
          color: #718096;
          margin: 0;
          font-size: 1.1rem;
        }

        .cooked-text {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 16px;
          padding: 2rem;
          border: 2px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .cooked-text .content-text {
          background: transparent;
          border: none;
          padding: 0;
          font-size: 1rem;
          max-height: 600px;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .viewer-controls {
            flex-direction: column;
            align-items: center;
          }
          
          .tab-btn {
            width: 250px;
          }
          
          .content-panel {
            margin: 0 1rem;
            padding: 1.5rem;
          }
          
          .doc-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .document-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
} 