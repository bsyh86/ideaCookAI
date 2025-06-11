import { useState } from 'react';
import Layout from '../components/Layout';
import ActionButton from '../components/ActionButton';
import StatusDisplay from '../components/StatusDisplay';
import DocumentViewer from '../components/DocumentViewer';

export default function Home() {
  const [appState, setAppState] = useState('IDLE');
  const [statusMessage, setStatusMessage] = useState('Ready to begin analysis.');
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [cookedIdeas, setCookedIdeas] = useState(null);

  const handleIngredientsClick = async () => {
    setAppState('INGREDIENTS_PENDING');
    setStatusMessage('Gathering Ingredients: Scanning documents...');
    
    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setAppState('INGREDIENTS_DONE');
        setStatusMessage(data.message);
        setStats(data.stats);
        
        // Fetch documents with classifications
        try {
          const docsResponse = await fetch('/api/documents');
          const docsData = await docsResponse.json();
          if (docsData.success) {
            setDocuments(docsData.documents);
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      } else {
        setAppState('ERROR');
        setStatusMessage('Error: ' + data.error);
      }
    } catch (error) {
      setAppState('ERROR');
      setStatusMessage('An error occurred. Please check the server console for details.');
    }
  };

  const handleCookClick = async () => {
    setAppState('COOK_PENDING');
    setStatusMessage('Cooking: Synthesizing ideas...');
    
    try {
      const response = await fetch('/api/cook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setAppState('COOK_DONE');
        setStatusMessage(data.message);
        setCookedIdeas(data.cookedIdeas);
      } else {
        setAppState('ERROR');
        setStatusMessage('Error: ' + data.error);
      }
    } catch (error) {
      setAppState('ERROR');
      setStatusMessage('An error occurred. Please check the server console for details.');
    }
  };

  const handleServeClick = async () => {
    setAppState('SERVE_PENDING');
    setStatusMessage('Serving: Distributing ideas and updating scores...');
    
    try {
      const response = await fetch('/api/serve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setAppState('COMPLETE');
        setStatusMessage('Complete! All ideas have been processed and scored.');
      } else {
        setAppState('ERROR');
        setStatusMessage('Error: ' + data.error);
      }
    } catch (error) {
      setAppState('ERROR');
      setStatusMessage('An error occurred. Please check the server console for details.');
    }
  };

  const handleStartOver = () => {
    setAppState('IDLE');
    setStatusMessage('Ready to begin analysis.');
    setStats(null);
    setDocuments(null);
    setCookedIdeas(null);
  };

  const handleTryAgain = () => {
    setAppState('IDLE');
    setStatusMessage('Ready to begin analysis.');
    setStats(null);
    setDocuments(null);
    setCookedIdeas(null);
  };

  return (
    <Layout>
      <div className="container">
        <h1 className="title">IdeaCook.AI</h1>
        <p className="subtitle">Transform your team's ideas into actionable insights</p>
        
        <div className="pipeline">
          <ActionButton
            text="Get Ingredients"
            state={appState}
            targetState="INGREDIENTS"
            onClick={handleIngredientsClick}
          />
          
          <ActionButton
            text="COOK"
            state={appState}
            targetState="COOK"
            onClick={handleCookClick}
          />
          
          <ActionButton
            text="Serve"
            state={appState}
            targetState="SERVE"
            onClick={handleServeClick}
          />
        </div>

        <StatusDisplay 
          message={statusMessage} 
          state={appState} 
          stats={stats}
        />

        <DocumentViewer 
          documents={documents} 
          cookedIdeas={cookedIdeas}
        />

        {appState === 'COMPLETE' && (
          <div className="actions">
            <button className="secondary-btn" onClick={handleStartOver}>
              Start Over
            </button>
          </div>
        )}

        {appState === 'ERROR' && (
          <div className="actions">
            <button className="secondary-btn" onClick={handleTryAgain}>
              Try Again
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }

        .title {
          font-size: 3.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 4rem;
          font-weight: 500;
        }

        .pipeline {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .actions {
          margin-top: 2rem;
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.9);
          color: #4a5568;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .secondary-btn:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .pipeline {
            flex-direction: column;
            align-items: center;
          }
          
          .title {
            font-size: 2rem;
          }
        }
      `}</style>
    </Layout>
  );
} 