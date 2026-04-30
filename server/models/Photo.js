const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  s3Key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  s3Url: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  caption: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  uploadedBy: {
    type: DataTypes.STRING,
    defaultValue: 'Anonymous',
  },
}, {
  tableName: 'photos',
  timestamps: true,
});

module.exports = Photo;
