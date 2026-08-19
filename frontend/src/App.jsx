import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('loading'); // loading, connected, disconnected
  const [connectionLog, setConnectionLog] = useState('');
  const [isPinging, setIsPinging] = useState(false);

  const checkBackend = async () => {
    setIsPinging(true);
    setConnectionStatus('loading');
    setConnectionLog('Pinging backend server at http://localhost:5000/api/health...');
    
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setConnectionStatus('connected');
      setConnectionLog(JSON.stringify(data, null, 2));
    } catch (error) {
      setConnectionStatus('disconnected');
      setConnectionLog(`Failed to connect to backend server.\n\nError: ${error.message}\n\nMake sure the Express backend server is running on port 5000.\nRun "cd backend && npm run dev" to start it.`);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <h1>MERN Stack Boilerplate</h1>
          <p>Your workspace is ready. Build something incredible.</p>
        </div>
        <div className="status-badge">
          <span className={`status-dot ${connectionStatus}`}></span>
          <span>
            {connectionStatus === 'loading' && 'Checking Connection...'}
            {connectionStatus === 'connected' && 'Backend Connected'}
            {connectionStatus === 'disconnected' && 'Backend Disconnected'}
          </span>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="dashboard-grid">
        {/* Left Side: Directory Structures */}
        <section className="card">
          <h2 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            Project Directory Structure
          </h2>
          
          <div className="structure-container">
            <div className="section-block">
              <h3>📂 backend/ (Node.js & Express)</h3>
              <div className="tree-list">
                <div className="tree-item">
                  <code>config/db.js</code>
                  <div className="tree-item-desc">Mongoose database configuration and connection logic.</div>
                </div>
                <div className="tree-item">
                  <code>controllers/</code>
                  <div className="tree-item-desc">Request handler functions that process route logic and DB calls.</div>
                </div>
                <div className="tree-item">
                  <code>models/</code>
                  <div className="tree-item-desc">Mongoose schemas mapping to MongoDB collections.</div>
                </div>
                <div className="tree-item">
                  <code>routes/</code>
                  <div className="tree-item-desc">Express route declarations directing endpoints to controllers.</div>
                </div>
                <div className="tree-item">
                  <code>middleware/</code>
                  <div className="tree-item-desc">Custom middlewares for request processing, authentication, and error handling.</div>
                </div>
                <div className="tree-item">
                  <code>server.js</code>
                  <div className="tree-item-desc">Express server initialization, middleware binding, and port listener.</div>
                </div>
              </div>
            </div>

            <div className="section-block">
              <h3>📂 frontend/src/ (React + Vite)</h3>
              <div className="tree-list">
                <div className="tree-item">
                  <code>components/</code>
                  <div className="tree-item-desc">Reusable pure UI components (buttons, navbars, forms).</div>
                </div>
                <div className="tree-item">
                  <code>pages/</code>
                  <div className="tree-item-desc">Top-level React views corresponding to frontend routes.</div>
                </div>
                <div className="tree-item">
                  <code>context/</code>
                  <div className="tree-item-desc">Global React context providers (e.g., auth context, UI context).</div>
                </div>
                <div className="tree-item">
                  <code>hooks/</code>
                  <div className="tree-item-desc">Custom React hooks for fetch logic, state listeners, or utilities.</div>
                </div>
                <div className="tree-item">
                  <code>services/</code>
                  <div className="tree-item-desc">HTTP client layers and API request configurations.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Connectivity and Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="card">
            <h2 className="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Server Connection
            </h2>
            <div className="control-panel">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Ping the local backend server API health check endpoint to verify connectivity:
              </p>
              
              <button 
                className="btn" 
                onClick={checkBackend} 
                disabled={isPinging}
              >
                {isPinging ? 'Pinging Server...' : 'Ping Backend API'}
              </button>

              <div className={`response-box ${connectionStatus === 'connected' ? 'success' : 'error'}`}>
                <pre>{connectionLog}</pre>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
              Quick Controls
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Keep both terminals running simultaneously to see updates instantly:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                  <strong>Server Port:</strong> <code>5000</code>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                  <strong>Vite Client:</strong> <code>5173</code>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>Created basic structure folders for workspace DSDL</p>
      </footer>
    </div>
  );
}

export default App;
