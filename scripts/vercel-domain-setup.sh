#!/bin/bash

# Vercel Domain Setup Script
# This script adds multiple domains to a Vercel project

# Check if file argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 domains.txt"
  echo "domains.txt should contain one domain per line"
  exit 1
fi

# Check if file exists
if [ ! -f "$1" ]; then
  echo "Error: File $1 not found"
  exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Error: Vercel CLI is not installed. Please install it"
  exit 1
fi

# Bulk domain setup for Vercel
# Usage: ./vercel-domain-setup.sh domains.txt

if [ ! -f "$1" ]; then
    echo "Usage: $0 <domains-file>"
    echo "Create a domains.txt file with one domain per line"
    exit 1
fi

echo "Adding domains to Vercel project..."

while IFS= read -r domain; do
    if [ ! -z "$domain" ]; then
        echo "Adding $domain..."
        vercel domains add "$domain" --yes
        
        # Optional: Set up DNS automatically if you control the domains
        # vercel dns add "$domain" @ A 76.76.19.61
        # vercel dns add "$domain" www CNAME cname.vercel-dns.com
    fi
done < "$1"

echo "Domain setup complete!"
echo "Don't forget to:"
echo "1. Verify domain ownership in Vercel dashboard"
echo "2. Update DNS records for each domain"
echo "3. Add domains to your database using the admin panel"
