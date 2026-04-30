import { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import PhotoGrid from './components/PhotoGrid';

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPhotos = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/photos?page=${pageNum}&limit=20`);
      const data = await res.json();
      setPhotos(data.photos);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUploadSuccess = () => {
    fetchPhotos(1);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📸 PhotoShare</h1>
        <p>Share your moments with the world</p>
      </header>

      <main className="main">
        <UploadForm onSuccess={handleUploadSuccess} />

        {loading ? (
          <div className="loading">Loading photos...</div>
        ) : (
          <>
            <PhotoGrid photos={photos} onDelete={() => fetchPhotos(page)} />
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => fetchPhotos(page - 1)}
                  disabled={page <= 1}
                >
                  ← Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  onClick={() => fetchPhotos(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
