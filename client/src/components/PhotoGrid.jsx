import PhotoCard from './PhotoCard';

function PhotoGrid({ photos, onDelete }) {
  if (photos.length === 0) {
    return (
      <div className="empty-state">
        <p>No photos yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <section className="photo-grid-section">
      <h2>Recent Photos</h2>
      <div className="photo-grid">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}

export default PhotoGrid;
