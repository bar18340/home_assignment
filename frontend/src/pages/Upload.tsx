import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { designsAPI } from '../services/api';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await designsAPI.uploadSVG(file);
      setSuccess(`File uploaded successfully! ID: ${response.id}`);
      setFile(null);

      // Reset file input
      const fileInput = document.getElementById('svg-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Navigate to designs list after 2 seconds
      setTimeout(() => {
        navigate('/designs');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Upload SVG File</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            id="svg-file"
            type="file"
            accept=".svg"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ padding: '10px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!file || uploading}
          style={{
            padding: '10px 20px',
            backgroundColor: uploading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px' }}>
          {success}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => navigate('/designs')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          View All Designs
        </button>
      </div>
    </div>
  );
};

export default Upload;
