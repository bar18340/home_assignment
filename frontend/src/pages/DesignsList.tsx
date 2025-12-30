import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { designsAPI } from '../services/api';
import type { Design } from '../types';

const DesignsList: React.FC = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const data = await designsAPI.getAllDesigns();
      setDesigns(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading designs...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>All Designs</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Upload New SVG
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {designs.length === 0 ? (
        <p>No designs uploaded yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Filename</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Items</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Coverage</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Issues</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Created At</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {designs.map((design) => (
              <tr key={design._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{design.filename}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor:
                        design.status === 'PROCESSED'
                          ? '#e8f5e9'
                          : design.status === 'ERROR'
                          ? '#ffebee'
                          : '#fff3e0',
                      color:
                        design.status === 'PROCESSED'
                          ? '#2e7d32'
                          : design.status === 'ERROR'
                          ? '#c62828'
                          : '#e65100',
                    }}
                  >
                    {design.status}
                  </span>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{design.itemsCount ?? '-'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {design.coverageRatio !== undefined ? `${(design.coverageRatio * 100).toFixed(2)}%` : '-'}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {design.issues && design.issues.length > 0 ? design.issues.join(', ') : 'None'}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{formatDate(design.createdAt)}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => navigate(`/designs/${design._id}`)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DesignsList;
