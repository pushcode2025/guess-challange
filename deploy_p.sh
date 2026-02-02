#!/bin/bash

echo "🚀 Building Vue project..."
npm run build

echo "📦 Uploading to server..."
scp -r ./dist/* khamminha.com_jwlg1igybem@157.173.203.61:/var/www/vhosts/khamminha.com/httpdocs/

echo "🎉 Deployment complete!"
