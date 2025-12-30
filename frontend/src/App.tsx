import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Upload from './pages/Upload';
import DesignsList from './pages/DesignsList';
import DesignDetail from './pages/DesignDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header style={{
          backgroundColor: '#282c34',
          padding: '20px',
          color: 'white',
          marginBottom: '0'
        }}>
          <h1 style={{ margin: 0 }}>SVG Processor</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Upload, Process, and Preview SVG Files</p>
        </header>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/designs" element={<DesignsList />} />
          <Route path="/designs/:id" element={<DesignDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
