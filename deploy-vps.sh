#!/bin/bash
# ==============================================
# Client Co-Creation Portal - VPS Deployment
# VPS: 148.230.81.154 (Ubuntu 24.04 with n8n)
# ==============================================

# SET YOUR DOMAIN HERE
DOMAIN="cocreate.innovativeautomations.dev"

echo "=== Deploying Client Co-Creation Portal ==="
echo "Domain: $DOMAIN"
echo ""

# Step 1: Clone repository
echo ">>> Cloning repository..."
cd /opt
if [ -d "client-cocreation-portal" ]; then
    echo "Directory exists, pulling latest..."
    cd client-cocreation-portal
    git pull
else
    git clone https://github.com/IGTA-Tech/client-cocreation-portal.git
    cd client-cocreation-portal
fi

# Step 2: Create environment file
echo ">>> Creating .env file..."
echo ">>> IMPORTANT: You must edit .env with real API keys before continuing!"
cat > .env << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<GET_FROM_PROJECT_ADMIN>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<GET_FROM_PROJECT_ADMIN>
SUPABASE_SERVICE_ROLE_KEY=<GET_FROM_PROJECT_ADMIN>

# Anthropic (Claude)
ANTHROPIC_API_KEY=<GET_FROM_PROJECT_ADMIN>

# SendGrid
SENDGRID_API_KEY=<GET_FROM_PROJECT_ADMIN>

# Perplexity
PERPLEXITY_API_KEY=<GET_FROM_PROJECT_ADMIN>
EOF

echo ""
echo ">>> .env file created with placeholders."
echo ">>> Edit /opt/client-cocreation-portal/.env with real values before proceeding."
echo ">>> Run: nano /opt/client-cocreation-portal/.env"
echo ""
read -p "Press ENTER after you've added the real API keys to .env..."

# Step 3: Build and start Docker container
echo ">>> Building and starting Docker container..."
docker compose down 2>/dev/null
docker compose up -d --build

echo ">>> Waiting for container to start..."
sleep 10

# Verify container is running
if docker compose ps | grep -q "running"; then
    echo ">>> Container is running!"
else
    echo ">>> ERROR: Container failed to start. Check logs:"
    docker compose logs
    exit 1
fi

# Step 4: Configure Nginx
echo ">>> Configuring Nginx for $DOMAIN..."
cat > /etc/nginx/sites-available/cocreate << NGINXEOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINXEOF

# Enable site
ln -sf /etc/nginx/sites-available/cocreate /etc/nginx/sites-enabled/

# Test and reload Nginx
echo ">>> Testing Nginx configuration..."
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo ">>> Nginx configured successfully!"
else
    echo ">>> ERROR: Nginx configuration failed"
    exit 1
fi

# Step 5: Get SSL certificate
echo ">>> Getting SSL certificate for $DOMAIN..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@innovativeautomations.dev

echo ""
echo "=== DEPLOYMENT COMPLETE ==="
echo ""
echo "Your app should be live at: https://$DOMAIN"
echo ""
echo "Useful commands:"
echo "  View logs:     cd /opt/client-cocreation-portal && docker compose logs -f"
echo "  Restart:       cd /opt/client-cocreation-portal && docker compose restart"
echo "  Update:        cd /opt/client-cocreation-portal && git pull && docker compose up -d --build"
echo ""
