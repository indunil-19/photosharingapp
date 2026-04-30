import { useState } from 'react';

function UploadForm({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a photo to upload.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('photo', file);
    if (caption) formData.append('caption', caption);
    if (uploadedBy) formData.append('uploadedBy', uploadedBy);

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed.');
      }

      // Reset form
      setFile(null);
      setCaption('');
      setUploadedBy('');
      setPreview(null);
      e.target.reset();
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="upload-section">
      <h2>Upload a Photo</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-wrapper">
          <label className="file-label">
            {preview ? (
              <img src={preview} alt="Preview" className="preview-img" />
            ) : (
              <div className="file-placeholder">
                <span>📷</span>
                <p>Click to select a photo</p>
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="file-input"
            />
          </label>
        </div>

        <div className="form-fields">
          <input
            type="text"
            placeholder="Add a caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={500}
          />
          <input
            type="text"
            placeholder="Your name (optional)"
            value={uploadedBy}
            onChange={(e) => setUploadedBy(e.target.value)}
            maxLength={100}
          />
          <button type="submit" disabled={uploading || !file}>
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}

export default UploadForm;
