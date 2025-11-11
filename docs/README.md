# Rokwil Website - GitHub Pages

This folder contains the static HTML version of the Rokwil Property Development website, ready for deployment to GitHub Pages.

## Setup Instructions

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push your code:**
   - The GitHub Actions workflow will automatically deploy the site when you push to the `main` branch
   - The workflow is located at `.github/workflows/deploy.yml`

3. **Access your site:**
   - After deployment, your site will be available at: `https://[your-username].github.io/[repository-name]/`
   - Or if using a custom domain, configure it in the Pages settings

## File Structure

```
docs/
├── index.html      # Home page
├── about.html      # About page
├── projects.html   # Projects page
├── contact.html    # Contact page
├── css/
│   └── site.css    # Stylesheet
└── js/
    └── site.js     # JavaScript
```

## Local Testing

To test the site locally before deploying:

1. Open `docs/index.html` in a web browser
2. Or use a local server:
   ```bash
   # Python 3
   cd docs
   python -m http.server 8000
   
   # Node.js
   npx serve docs
   ```

## Notes

- All ASP.NET Razor syntax has been converted to static HTML
- All links use relative paths for GitHub Pages compatibility
- The site is fully static and doesn't require a server

