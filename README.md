# PhotoShare App

A photo sharing application where anyone can upload and view photos. Built with Node.js + Express (backend) and React (frontend), served as a single service on one port.

## Architecture

```
Users → ALB → EC2 (This App) → RDS (PostgreSQL)
                                  ↓
                              S3 (Image Storage)
                                  ↑
                          Lambda (Metadata Extraction)
```

## Tech Stack

- **Backend**: Node.js, Express, Sequelize ORM
- **Frontend**: React, Vite
- **Database**: PostgreSQL (AWS RDS)
- **Storage**: AWS S3
- **File Upload**: Multer + multer-s3

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required config:
- **Database**: RDS endpoint, credentials, database name
- **AWS**: Region, access keys, S3 bucket name

### 3. Create S3 Bucket

Create an S3 bucket and configure it for public read access (for serving images):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/photos/*"
    }
  ]
}
```

### 4. Create PostgreSQL Database

```sql
CREATE DATABASE photosharing;
```

Tables are auto-created by Sequelize on first run.

### 5. Run the app

**Development** (separate frontend/backend servers with hot reload):
```bash
npm run dev
```

**Production** (single port, frontend built and served by Express):
```bash
npm run build
NODE_ENV=production npm start
```

The app will be available at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/photos?page=1&limit=20` | Get paginated photos |
| POST | `/api/photos` | Upload a photo (multipart form) |
| DELETE | `/api/photos/:id` | Delete a photo |

## Deployment on EC2

1. Install Node.js 18+ on your EC2 instance
2. Clone/copy the app to the instance
3. Run `npm run install:all`
4. Run `npm run build` to build the frontend
5. Set `NODE_ENV=production` in your `.env`
6. Start with `npm start` (or use PM2: `pm2 start server/index.js`)

## Lambda Integration (Metadata Extraction)

Set up an S3 event trigger on your bucket to invoke a Lambda function when photos are uploaded. The Lambda can extract EXIF data, generate thumbnails, etc.
