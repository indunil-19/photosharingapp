const express = require('express');
const router = express.Router();
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Photo = require('../models/Photo');
const { upload, s3Client } = require('../middleware/upload');

// GET /api/photos - Get all photos (newest first)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: photos } = await Photo.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      photos,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPhotos: count,
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos.' });
  }
});

// POST /api/photos - Upload a photo
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const photo = await Photo.create({
      originalName: req.file.originalname,
      s3Key: req.file.key,
      s3Url: req.file.location,
      mimeType: req.file.mimetype,
      size: req.file.size,
      caption: req.body.caption || null,
      uploadedBy: req.body.uploadedBy || 'Anonymous',
    });

    res.status(201).json(photo);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo.' });
  }
});

// DELETE /api/photos/:id - Delete a photo
router.delete('/:id', async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found.' });
    }

    // Delete from S3
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: photo.s3Key,
    }));

    // Delete from database
    await photo.destroy();

    res.json({ message: 'Photo deleted successfully.' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo.' });
  }
});

module.exports = router;
