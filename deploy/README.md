# Frontend Deployment Files

This directory contains the files the server or operations side needs for the frontend deployment.

## Files

- `deploy.env.example`
  - Copy to `deploy.env` and replace placeholders with the real deployment values.
- `server-setup.sh`
  - Prepares the deploy directory for static frontend files.

## What Must Be Copied To The Server

1. Frontend build output
   - Upload the contents of `dist/` to:
     - `/var/www/volunteer-system-frontend`

## Backend API Configuration

The frontend production API base URL is configured in `.env.production`.

Current temporary internal testing value:

```env
VITE_API_BASE_URL=http://eco.volunteer.com
```

After the backend TLS certificate is ready, switch it to:

```env
VITE_API_BASE_URL=https://eco.volunteer.com
```

## Server Checklist

- Deployment directory created
- Static file server is configured separately if needed

## Example Commands

```bash
sudo mkdir -p /var/www/volunteer-system-frontend
sudo chown -R deploy:deploy /var/www/volunteer-system-frontend
```

## Recommended Preparation Flow

1. Copy `deploy/deploy.env.example` to `deploy/deploy.env`
2. Fill in the real deployment path
3. Run:

```bash
bash deploy/server-setup.sh deploy/deploy.env
```
