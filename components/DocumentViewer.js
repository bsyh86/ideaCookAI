import { useState } from 'react';

export default function DocumentViewer({ documents, cookedIdeas }) {
  const [activeTab, setActiveTab] = useState(null);

  if (!documents && !cookedIdeas) return null;

  const groupedDocs = documents ? {
    relevant: documents.filter(doc => doc.classification === 'RELEVANT'),
    vague: documents.filter(doc => doc.classification === 'VAGUE'),
    irrelevant: documents.filter(doc => doc.classification === 'IRRELEVANT')
  } : {};

  const renderDocuments = (docs) => (
    <div className="documents-list">
      {docs.map((doc, index) => (
        <div key={index} className="document-card">
          <div className="doc-header">
            <h4>{doc.filename}</h4>
            <span className="author">{doc.author}</span>
          </div>
          <div className="doc-content">
            <pre>{doc.content}</pre>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCookedIdeas = () => (
    <div className="cooked-content">
      <div className="cooked-header">
        <h3>🍳 Synthesized Ideas</h3>
        <p>AI-generated collaborative insights from relevant documents</p>
      </div>
      <div className="cooked-text">
        <pre>{cookedIdeas}</pre>
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
          max-width: 1000px;
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
          gap: 1.5rem;
        }

        .document-card {
          background: #f7fafc;
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #e2e8f0;
          transition: all 0.2s;
        }

        .document-card:hover {
          border-color: #cbd5e0;
          transform: translateY(-1px);
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .doc-header h4 {
          margin: 0;
          color: #2d3748;
          font-size: 1.1rem;
        }

        .author {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .doc-content {
          max-height: 300px;
          overflow-y: auto;
        }

        .doc-content pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
          margin: 0;
          color: #4a5568;
          line-height: 1.6;
        }

        .cooked-content {
          text-align: center;
        }

        .cooked-header {
          margin-bottom: 2rem;
        }

        .cooked-header h3 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
          font-size: 1.8rem;
        }

        .cooked-header p {
          color: #718096;
          margin: 0;
        }

        .cooked-text {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 12px;
          padding: 2rem;
          border: 2px solid #e2e8f0;
          max-height: 500px;
          overflow-y: auto;
          text-align: left;
        }

        .cooked-text pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
          margin: 0;
          color: #2d3748;
          line-height: 1.7;
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
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
} 