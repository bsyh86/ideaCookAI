export default function ActionButton({ text, state, targetState, onClick }) {
  const getButtonState = () => {
    const isPending = state === `${targetState}_PENDING`;
    const isDone = state === `${targetState}_DONE` || 
                   (targetState === 'COOK' && (state === 'COOK_DONE' || state === 'SERVE_PENDING' || state === 'COMPLETE')) ||
                   (targetState === 'INGREDIENTS' && (state !== 'IDLE' && state !== 'ERROR')) ||
                   (targetState === 'SERVE' && state === 'COMPLETE');
    
    const isDisabled = state === 'ERROR' || isPending || 
                      (targetState === 'COOK' && state !== 'INGREDIENTS_DONE' && state !== 'COOK_DONE' && state !== 'SERVE_PENDING' && state !== 'COMPLETE') ||
                      (targetState === 'SERVE' && state !== 'COOK_DONE' && state !== 'COMPLETE');
    
    const isActive = (targetState === 'INGREDIENTS' && state === 'IDLE') ||
                    (targetState === 'COOK' && state === 'INGREDIENTS_DONE') ||
                    (targetState === 'SERVE' && state === 'COOK_DONE');

    return { isPending, isDone, isDisabled, isActive };
  };

  const { isPending, isDone, isDisabled, isActive } = getButtonState();

  return (
    <button
      className={`btn ${isDone ? 'completed' : ''} ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={isDisabled || isPending}
    >
      <div className="btn-content">
        {isPending ? (
          <>
            <div className="spinner"></div>
            <span>Processing...</span>
          </>
        ) : isDone ? (
          <>
            <span className="checkmark">✓</span>
            <span>{text}</span>
          </>
        ) : (
          <span>{text}</span>
        )}
      </div>

      <style jsx>{`
        .btn {
          background: ${isActive ? '#4299e1' : isDone ? '#48bb78' : '#e2e8f0'};
          color: ${isActive || isDone ? 'white' : '#4a5568'};
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
          transition: all 0.3s ease;
          min-width: 180px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
        }

        .btn:not(.disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .btn.disabled {
          opacity: 0.6;
        }

        .btn.active {
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
          animation: pulse 2s infinite;
        }

        .btn.completed {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        .checkmark {
          font-size: 1.2rem;
          font-weight: bold;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @media (max-width: 768px) {
          .btn {
            min-width: 160px;
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </button>
  );
} 