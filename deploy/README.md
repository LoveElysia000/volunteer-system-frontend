# Frontend Deployment Files

This directory contains the files the server or operations side needs for the frontend deployment.

## Files

- `nginx.http.conf`
  - Use this for temporary HTTP-only internal testing.
- `nginx.https.conf`
  - Use this after the frontend domain has a valid TLS certificate.
- `deploy.env.example`
  - Copy to `deploy.env` and replace placeholders with the real deployment values.
- `server-setup.sh`
  - Prepares the deploy directory and prints the exact Nginx installation steps.

## What Must Be Copied To The Server

1. One Nginx site config file
   - Copy either `nginx.http.conf` or `nginx.https.conf` to:
     - `/etc/nginx/conf.d/volunteer-system-frontend.conf`
     - or `/etc/nginx/sites-available/volunteer-system-frontend`
2. Frontend build output
   - Upload the contents of `dist/` to:
     - `/var/www/volunteer-system-frontend`

## Values To Replace Before Using

In both Nginx templates, replace:

- `your-frontend-domain.com`
  - The final frontend website domain, not the backend API domain.
- `/var/www/volunteer-system-frontend`
  - The real deployment directory if your server uses a different path.

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

- Nginx installed
- Deployment directory created
- Frontend domain resolved to the server
- HTTPS certificate ready if using `nginx.https.conf`
- Nginx reloaded after the config is installed

## Example Commands

```bash
sudo mkdir -p /var/www/volunteer-system-frontend
sudo chown -R deploy:deploy /var/www/volunteer-system-frontend
sudo cp deploy/nginx.http.conf /etc/nginx/conf.d/volunteer-system-frontend.conf
sudo nginx -t
sudo systemctl reload nginx
```

## Recommended Preparation Flow

1. Copy `deploy/deploy.env.example` to `deploy/deploy.env`
2. Fill in the real frontend domain and deployment path
3. Run:

```bash
bash deploy/server-setup.sh deploy/deploy.env
```

4. Copy the selected Nginx file to the server config path
5. Replace the placeholders in the copied Nginx file
6. Reload Nginx
