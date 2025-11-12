# Rokwil Property Development Website

A modern, responsive static website for Rokwil Property Development, deployed on GitHub Pages.

## Features

- 🎨 Modern, sleek design with property development themes
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth animations and transitions
- 🌙 Dark mode support
- 🏗️ Showcase of major projects (Keystone Park, Judges Court)
- 📧 Contact form with Static Forms integration
- 🎯 SEO-friendly structure with Open Graph and Twitter Card meta tags
- 📹 Video showcase section

## Project Structure

```
Rokwil-Website/
├── docs/
│   ├── index.html          # Home page
│   ├── about.html          # About page
│   ├── projects.html       # Projects page
│   ├── contact.html        # Contact page
│   ├── css/
│   │   └── site.css        # Main stylesheet
│   ├── js/
│   │   └── site.js         # JavaScript functionality
│   ├── images/
│   │   └── image.webp      # Images
│   └── videos/
│       └── Rokwil.mp4      # Video content
├── LICENSE
└── README.md
```

## Technologies Used

- HTML5 & CSS3
- Vanilla JavaScript
- Google Fonts (Inter & Playfair Display)
- Bootstrap Icons
- Static Forms (for contact form submissions)

## Pages

- **Home** (`index.html`): Hero section, video showcase, features, project showcase, testimonials, news section, and statistics
- **About** (`about.html`): Company story and values
- **Projects** (`projects.html`): Detailed information about Keystone Park and Judges Court
- **Contact** (`contact.html`): Contact form with Static Forms integration and company information

## Customization

The website uses CSS custom properties (variables) defined in `docs/css/site.css` for easy theming. You can modify colors, fonts, and other design elements by updating the `:root` variables.

## Local Development

To test the website locally:

### Option 1: Simple HTTP Server (Python)

```bash
# Navigate to docs folder
cd docs

# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

### Option 2: Node.js Serve

```bash
# From project root
npx serve docs

# Or navigate to docs folder first
cd docs
npx serve
```

### Option 3: VS Code Live Server

If using Visual Studio Code, install the "Live Server" extension and right-click on any HTML file to open with Live Server.

## GitHub Pages Deployment

This website is deployed to GitHub Pages from the `docs/` folder.

### Setup Instructions

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Select the `main` branch and `/docs` folder
   - Click **Save**

2. **Access Your Site:**
   - After enabling, your site will be available at: `https://[your-username].github.io/[repository-name]/`
   - It may take a few minutes for the site to be available initially

### Contact Form Setup

The contact form uses Static Forms (free service, 500 emails/month). The access key is already configured in `contact.html`. To update it:

1. Go to https://www.staticforms.xyz/
2. Enter your email address
3. Get your access key
4. Update the `accessKey` value in `docs/contact.html` (line 214)

## License

This project is created for Rokwil Property Development.

