# Rokwil Property Development Website

A modern, responsive website for Rokwil Property Development built with ASP.NET Core MVC.

## Features

- 🎨 Modern, sleek design with property development themes
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth animations and transitions
- 🏗️ Showcase of major projects (Keystone Park, Judges Court)
- 📧 Contact form
- 🎯 SEO-friendly structure

## Getting Started

### Prerequisites

- .NET 8.0 SDK or later
- A code editor (Visual Studio, VS Code, Rider, etc.)

### Running the Application

1. Open a terminal in the project directory
2. Run the following command:

```bash
dotnet run
```

3. Open your browser and navigate to:
   - HTTPS: `https://localhost:5001`
   - HTTP: `http://localhost:5000`

### Building the Application

```bash
dotnet build
```

## Project Structure

```
RokwilWebsite/
├── Controllers/
│   └── HomeController.cs
├── Views/
│   ├── Home/
│   │   ├── Index.cshtml
│   │   ├── About.cshtml
│   │   ├── Projects.cshtml
│   │   └── Contact.cshtml
│   └── Shared/
│       └── _Layout.cshtml
├── wwwroot/
│   ├── css/
│   │   └── site.css
│   └── js/
│       └── site.js
├── Program.cs
└── RokwilWebsite.csproj
```

## Technologies Used

- ASP.NET Core 8.0 MVC
- HTML5 & CSS3
- JavaScript (Vanilla)
- Google Fonts (Inter & Playfair Display)

## Pages

- **Home**: Hero section, features, project showcase, and statistics
- **About**: Company story and values
- **Projects**: Detailed information about Keystone Park and Judges Court
- **Contact**: Contact form and company information

## Customization

The website uses CSS custom properties (variables) defined in `wwwroot/css/site.css` for easy theming. You can modify colors, fonts, and other design elements by updating the `:root` variables.

## GitHub Pages Deployment

This project has been set up for deployment to GitHub Pages. The static HTML version is located in the `docs/` folder.

### Setup Instructions

1. **Enable GitHub Pages (IMPORTANT - Do this first!):**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions** (NOT "Deploy from a branch")
   - Click **Save**
   - **Note:** The workflow includes automatic enablement, but manually enabling ensures it works correctly

2. **Automatic Deployment:**
   - The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically deploy the site when you push to the `main` branch
   - The first deployment may take a few minutes to set up

3. **Access Your Site:**
   - After deployment, your site will be available at: `https://[your-username].github.io/[repository-name]/`
   - Deployment typically takes 1-2 minutes after pushing

### Local Testing

To test the static site locally before deploying:

```bash
# Navigate to docs folder
cd docs

# Python 3
python -m http.server 8000

# Node.js
npx serve docs
```

Then open `http://localhost:8000` in your browser.

## License

This project is created for Rokwil Property Development.

