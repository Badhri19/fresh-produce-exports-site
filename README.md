# FRIENDS FARM FRESH - Static Website

Professional B2B export website for an India-based agricultural export company.

## Overview
This project is a static website built with:
- HTML
- CSS
- JavaScript
- Local image assets

The website showcases:
- Home page
- About page
- Product category pages (rice, fresh vegetables, fresh fruits, spices, pulses & grains)
- Export and packaging information
- Global markets section
- Contact and inquiry forms
- Contact actions via WhatsApp and Email draft links (no backend)

## Static Hosting Compatibility
This site is fully static and works on GitHub Pages without backend services.

## Key Files
- `index.html` - homepage
- `styles.css` - shared styling
- `script.js` - shared behavior and form draft logic
- `assets/` - images and product media

## Deploy to GitHub Pages (Main Branch)
1. Create a new GitHub repository (for example: `friends-farm-fresh-site`).
2. Push this full project to the repository.
3. In GitHub: `Settings -> Pages`.
4. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Save and wait for deployment.
6. Your site will be available at:
   - `https://<your-github-username>.github.io/<repository-name>/`

## Custom Domain (Later)
To connect a custom domain later:
1. In GitHub Pages settings, set your custom domain (for example: `friendsfarmfresh.in`).
2. Update DNS records at your domain registrar:
   - `A` records to GitHub Pages IPs (for apex domain)
   - `CNAME` record to `<your-github-username>.github.io` (for subdomain like `www`)
3. Enable HTTPS in GitHub Pages settings.

## Notes
- `.nojekyll` is included so GitHub Pages serves all static files exactly as-is.
- No server-side runtime is required.


