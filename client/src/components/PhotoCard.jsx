function PhotoCard({ photo, onDelete }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const res = await fetch(`/api/photos/${photo.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete();
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="photo-card">
      <div className="photo-image-wrapper">
        <img src={photo.s3Url} alt={photo.caption || 'Shared photo'} loading="lazy" />
      </div>
      <div className="photo-info">
        {photo.caption && <p className="photo-caption">{photo.caption}</p>}
        <div className="photo-meta">
          <span className="photo-author">By {photo.uploadedBy}</span>
          <span className="photo-date">{formatDate(photo.createdAt)}</span>
        </div>
        <button className="delete-btn" onClick={handleDelete} title="Delete photo">
          🗑️
        </button>
      </div>
    </div>
  );
}

export default PhotoCard;
