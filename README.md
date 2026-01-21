# Client Co-Creation Portal

A Next.js application for client project intake, AI-powered conversations, and specification generation.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude API
- **Email:** SendGrid
- **Styling:** Tailwind CSS

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic (Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key

# SendGrid (for email notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
```

---

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## VPS Deployment (Hostinger/Ubuntu)

### Prerequisites

- Ubuntu 20.04+ VPS
- Domain pointing to VPS IP (A record)
- SSH access as root

### Step 1: SSH into VPS

```bash
ssh root@YOUR_VPS_IP
```

### Step 2: Install Docker (if not installed)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

Log out and back in for docker group to take effect.

### Step 3: Install Nginx & Certbot

```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### Step 4: Clone Repository

```bash
cd /opt
git clone https://github.com/IGTA-Tech/client-cocreation-portal.git
cd client-cocreation-portal
```

### Step 5: Create Environment File

```bash
cat > .env << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
EOF
```

> Get these values from the project admin or existing `.env.local` file.

### Step 6: Build and Start Docker Container

```bash
docker compose up -d --build
```

Verify it's running:
```bash
docker compose ps
docker compose logs -f
```

### Step 7: Configure Nginx (Reverse Proxy)

Create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/cocreate
```

Paste this configuration (replace `YOUR_DOMAIN` with your actual domain):

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -sf /etc/nginx/sites-available/cocreate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: Get SSL Certificate

```bash
sudo certbot --nginx -d YOUR_DOMAIN
```

Follow the prompts to complete SSL setup.

### Step 9: Verify Deployment

```bash
# Check container status
docker compose ps

# Test locally
curl http://localhost:3000

# Test publicly
curl https://YOUR_DOMAIN
```

---

## Running Alongside Other Apps (e.g., n8n)

If you already have n8n or other apps running on the same VPS:

1. **Each app runs on a different port:**
   - n8n: typically port 5678
   - Co-Create Portal: port 3000

2. **Nginx routes by domain:**
   - `n8n.yourdomain.com` → localhost:5678
   - `cocreate.yourdomain.com` → localhost:3000

3. **Create separate Nginx configs** for each domain in `/etc/nginx/sites-available/`

4. **Get SSL certificates** for each domain separately.

---

## Maintenance Commands

```bash
# View logs
docker compose logs -f

# Restart application
docker compose restart

# Update to latest code
cd /opt/client-cocreation-portal
git pull
docker compose down
docker compose up -d --build

# Check disk space
df -h

# Renew SSL (usually automatic)
sudo certbot renew
```

---

## Troubleshooting

### Container won't start
```bash
docker compose logs
```

### Port already in use
```bash
sudo lsof -i :3000
# Kill the process or change the port in docker-compose.yml
```

### Nginx errors
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Environment variables not loading
Make sure `.env` file exists in `/opt/client-cocreation-portal/` and restart:
```bash
docker compose down
docker compose up -d --build
```

---

## Support

For issues, contact the development team or open an issue in this repository.
