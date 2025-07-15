# Easy Technology Radar

A customizable technology radar with dynamic dimensions, built with Next.js and deployed to GitHub Pages.

## Features

- 🕸️ **Spider Chart Visualization**: Multi-dimensional radar chart showing technology relevance across different dimensions
- 🎯 **Dynamic Dimensions**: Easily configurable dimensions (not limited to 4 quadrants)
- 🔄 **Ring-based Classification**: Adopt, Trial, Assess, Hold methodology
- 🏷️ **Tag-based Filtering**: Filter technologies by tags and categories
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 📊 **Multiple Views**: Radar view, detailed technology pages, and comprehensive overview table
- 🚀 **Static Site**: No backend required, deploys to GitHub Pages
- 📝 **JSON Configuration**: Simple file-based content management

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd technology-radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Build and export static files
npm run export

# Files will be in ./out directory
```

## Configuration

### Adding Technologies

Edit `data/radar-config.json` to add or modify technologies:

```json
{
  "id": "your-technology",
  "name": "Your Technology",
  "ring": "adopt",
  "description": "Description of the technology",
  "rationale": "Why we chose this classification",
  "tags": ["tag1", "tag2"],
  "url": "https://technology-website.com",
  "isNew": false,
  "hasChanged": false,
  "dimensions": {
    "languages": 8,
    "tools": 2,
    "platforms": 5,
    "methods": 3
  }
}
```

### Modifying Dimensions

Update the `dimensions` array in `data/radar-config.json`:

```json
{
  "id": "new-dimension",
  "name": "New Dimension",
  "description": "Description of what this dimension covers",
  "color": "#ff6b6b"
}
```

### Customizing Rings

Modify the `rings` array to change classification levels:

```json
{
  "id": "custom-ring",
  "name": "Custom Ring",
  "description": "Description of this classification level",
  "color": "#4ecdc4",
  "radius": 150
}
```

## Project Structure

```
├── components/
│   ├── SpiderChart.js          # Main radar visualization
│   └── TechnologyList.js       # Technology listing component
├── data/
│   ├── radar-config.json       # Main configuration file
│   └── technologies/           # Optional: individual tech markdown files
├── lib/
│   └── dataLoader.js          # Data loading utilities
├── pages/
│   ├── index.js               # Main radar page
│   ├── about.js               # About/help page
│   ├── overview.js            # Table overview page
│   └── technologies/[id].js   # Individual technology pages
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages deployment
└── next.config.js             # Next.js configuration
```

## Deployment

### GitHub Pages (Recommended)

1. **Enable GitHub Pages** in your repository settings
2. **Set source** to "GitHub Actions"
3. **Push to main branch** - automatic deployment via GitHub Actions

The site will be available at: `https://yourusername.github.io/technology-radar/`

### Other Platforms

The built static files in `./out` can be deployed to:
- Netlify
- Vercel
- AWS S3
- Any static hosting provider

## Customization

### Styling

The project uses CSS-in-JS with styled-jsx. Modify styles directly in component files or create a global CSS file.

### Adding New Features

1. **New pages**: Add to `pages/` directory
2. **New components**: Add to `components/` directory  
3. **Data processing**: Extend `lib/dataLoader.js`

### Advanced Content Management

For more sophisticated content management, you can:

1. **Split into multiple files**: Use the `data/technologies/` directory for individual markdown files
2. **Add validation**: Implement JSON schema validation for configuration
3. **Automate updates**: Create scripts to import from external sources

## Content Guidelines

### Dimension Scores (0-10)

- **0-2**: Minimal relevance
- **3-4**: Some relevance  
- **5-6**: Moderate relevance
- **7-8**: High relevance
- **9-10**: Core/Essential in this dimension

### Ring Classifications

- **Adopt**: Proven, stable, recommended for use
- **Trial**: Ready for use but less proven, use with caution
- **Assess**: Worth investigating, not necessarily for trial yet
- **Hold**: Proceed with caution, may have issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

Inspired by the ThoughtWorks Technology Radar, reimagined with modern web technologies and customizable dimensions.