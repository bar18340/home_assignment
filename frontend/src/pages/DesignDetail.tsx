import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { designsAPI } from '../services/api';
import type { Design } from '../types';
import CanvasPreview from '../components/CanvasPreview';

const DesignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadDesign(id);
    }
  }, [id]);

  const loadDesign = async (designId: string) => {
    try {
      setLoading(true);
      const data = await designsAPI.getDesignById(designId);
      setDesign(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load design');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading design...</div>;
  }

  if (error || !design) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          {error || 'Design not found'}
        </div>
        <button
          onClick={() => navigate('/designs')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Designs
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/designs')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          ← Back to Designs
        </button>
      </div>

      <h1>Design Details</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div>
          <h2>Metadata</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Filename:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{design.filename}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Status:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
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
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>SVG Dimensions:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {design.svgWidth} × {design.svgHeight}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Items Count:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{design.itemsCount}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Coverage Ratio:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {design.coverageRatio !== undefined ? `${(design.coverageRatio * 100).toFixed(2)}%` : '-'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Issues:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {design.issues && design.issues.length > 0 ? (
                    <span style={{ color: '#c62828' }}>{design.issues.join(', ')}</span>
                  ) : (
                    <span style={{ color: '#2e7d32' }}>None</span>
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Created At:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(design.createdAt).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2>Canvas Preview</h2>
          {design.svgWidth && design.svgHeight && design.items ? (
            <CanvasPreview svgWidth={design.svgWidth} svgHeight={design.svgHeight} items={design.items} />
          ) : (
            <p>No preview available</p>
          )}
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <strong>Tip:</strong> Hover over rectangles to see details. Red borders indicate out-of-bounds rectangles.
          </p>
        </div>
      </div>

      {design.items && design.items.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>Rectangles Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>#</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>X</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Y</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Width</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Height</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Fill</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Issues</th>
              </tr>
            </thead>
            <tbody>
              {design.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.x}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.y}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.width}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.height}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: item.fill,
                          border: '1px solid #ccc',
                        }}
                      />
                      {item.fill}
                    </div>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {item.issues && item.issues.length > 0 ? (
                      <span style={{ color: '#c62828' }}>{item.issues.join(', ')}</span>
                    ) : (
                      <span style={{ color: '#2e7d32' }}>None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DesignDetail;
