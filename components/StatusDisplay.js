export default function StatusDisplay({ message, state, stats }) {
  const getStatusIcon = () => {
    if (state === 'ERROR') return '⚠️';
    if (state === 'COMPLETE') return '🎉';
    if (state.includes('PENDING')) return '⏳';
    if (state.includes('DONE')) return '✅';
    return '🚀';
  };

  const getStatusColor = () => {
    if (state === 'ERROR') return '#e53e3e';
    if (state === 'COMPLETE') return '#38a169';
    if (state.includes('PENDING')) return '#3182ce';
    if (state.includes('DONE')) return '#38a169';
    return '#4a5568';
  };

  return (
    <div className="status-container">
      <div className="status-message">
        <span className="status-icon">{getStatusIcon()}</span>
        <span className="message-text">{message}</span>
      </div>
      
      {stats && (
        <div className="stats">
          <h3>Analysis Results</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Documents</span>
            </div>
            <div className="stat-item relevant">
              <span className="stat-number">{stats.relevant}</span>
              <span className="stat-label">Relevant</span>
            </div>
            <div className="stat-item vague">
              <span className="stat-number">{stats.vague}</span>
              <span className="stat-label">Vague</span>
            </div>
            <div className="stat-item irrelevant">
              <span className="stat-number">{stats.irrelevant}</span>
              <span className="stat-label">Irrelevant</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .status-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 600px;
          margin: 0 auto;
        }

        .status-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: ${stats ? '2rem' : '0'};
        }

        .status-icon {
          font-size: 1.5rem;
        }

        .message-text {
          font-size: 1.1rem;
          font-weight: 500;
          color: ${getStatusColor()};
          text-align: center;
        }

        .stats {
          border-top: 1px solid #e2e8f0;
          padding-top: 1.5rem;
        }

        .stats h3 {
          text-align: center;
          margin-bottom: 1rem;
          color: #2d3748;
          font-size: 1.2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          border-radius: 12px;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          transition: all 0.2s;
        }

        .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-item.relevant {
          border-color: #48bb78;
          background: #f0fff4;
        }

        .stat-item.vague {
          border-color: #ed8936;
          background: #fffaf0;
        }

        .stat-item.irrelevant {
          border-color: #a0aec0;
          background: #f8f9fa;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #718096;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .status-container {
            padding: 1.5rem;
            margin: 0 1rem;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .message-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 