# Hostinger VPS KVM2 Deployment Steps

## One-time server setup
```bash
sudo apt update && sudo apt install -y nginx
sudo mkdir -p /var/www/tamil-jothidam-pro/dist
sudo chown -R $USER:$USER /var/www/tamil-jothidam-pro
sudo cp deploy/nginx.conf /etc/nginx/sites-available/tamil-jothidam
sudo ln -s /etc/nginx/sites-available/tamil-jothidam /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## Every deployment
```bash
bun install --frozen-lockfile
bun run build
# Upload dist/ folder to VPS:
rsync -avz dist/ user@YOUR_VPS_IP:/var/www/tamil-jothidam-pro/dist/
sudo systemctl reload nginx
```

## Environment variables on VPS
Create `/var/www/tamil-jothidam-pro/.env` with:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_key
```
