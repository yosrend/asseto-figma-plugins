# ASSETO AI Generate Tab - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Figma Desktop App (latest version)
- Node.js 16+ and npm
- Google Gemini API Key

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Plugin**
   ```bash
   npm run build
   ```
   
   This will create a `dist/` folder with:
   - `code.js` - Plugin backend code
   - `ui.html` - Plugin UI (with React bundled)

3. **Load Plugin in Figma**
   
   - Open Figma Desktop App
   - Go to **Plugins** → **Development** → **Import plugin from manifest...**
   - Select `manifest.json` from this folder
   - Plugin will be available under **Plugins** → **Development** → **Asseto**

4. **Setup Gemini API Key (First Time Only)**
   
   When you first run the plugin, you'll see a welcome screen:
   
   - Click **"Get API Key from Google"** button
   - This opens https://aistudio.google.com/api-keys
   - Login with your Google account
   - Click **"Create API Key"** or use existing one
   - Copy the API key
   - Return to Figma plugin
   - Paste your API key in the input field
   - Click **"Continue"**
   
   **Note:** Your API key is stored securely in browser session storage and is never sent to any third party.

## 📖 Development

### Development Mode (Watch Mode)
```bash
npm run dev
```

This will watch for file changes and automatically rebuild. Use Figma's hot reload feature to see changes instantly.

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint        # Check for errors
npm run lint:fix    # Auto-fix errors
```

## 🎨 Features Overview

### 1. **Prompt Input**
- Describe the images you want to generate
- Support for detailed descriptions
- Works with all style presets

### 2. **Reference Images (Optional)**
- Upload up to 4 reference images
- Paste from clipboard (Ctrl/Cmd + V)
- AI extracts style from references
- Applies extracted style to generated images

### 3. **Style Presets (9 Options)**
1. **Realistic Photography** - Natural documentary style
2. **Professional Photoshoot** - Magazine quality
3. **3D Rendering** - Clean geometric renders
4. **Minimalist Illustration** - Flat design
5. **Abstract Modern** - Contemporary art
6. **Isometric 3D** - Infographic style
7. **Claymorphism** - 3D clay materials
8. **Futuristic Neon** - Cyberpunk aesthetic
9. **Midjourney Weighted ✨** - Advanced weighted prompts

### 4. **Aspect Ratios**
- 16:9 (Landscape)
- 4:3 (Standard)
- 1:1 (Square)
- 3:4 (Portrait)
- 9:16 (Vertical)

### 5. **Batch Generation**
- Generate 1-20 images at once
- Progressive display (images appear as completed)
- Automatic retry on failures (3 attempts)
- Concurrency control (max 3 parallel requests)

### 6. **Gallery**
- Real-time progress display
- **"Add to Project"** button - Insert image directly to Figma canvas
- Copy to clipboard
- Download as PNG
- Lightbox view

## 🔧 Technical Details

### Architecture
```
src/
├── components/
│   ├── AIGenerateTab.tsx    # Main generation form
│   └── Gallery.tsx           # Image gallery
├── services/
│   └── geminiService.ts      # Gemini API integration
├── types/
│   └── index.ts              # TypeScript interfaces
├── constants/
│   └── index.ts              # Configuration constants
├── styles.css                # Tailwind CSS styles
└── index.tsx                 # React app entry point

code.ts                       # Figma plugin code
```

### API Integration

**Gemini API Endpoints Used:**
- `gemini-1.5-flash` - Style extraction from images
- `gemini-2.0-flash-exp` - Image generation

**Rate Limiting:**
- Maximum 3 concurrent requests
- Automatic retry with exponential backoff (2s, 4s, 8s)
- Non-retryable errors: Safety filter blocks

### Error Handling

**Retry Logic:**
- Transient errors: Retry up to 3 times
- Safety filter blocks: Immediate failure
- Network errors: Retry with backoff

**Status Display:**
- `generating` - In progress (spinner)
- `completed` - Success (show image)
- `failed` - Error (show error message)

## 🎯 Usage Tips

### Best Prompts
- Be specific and descriptive
- Include subject, action, environment
- Mention colors, mood, composition
- Example: "A modern smartphone on a white marble desk with soft morning light, minimalist composition, product photography"

### Reference Images
- Use high-quality images
- Consistent style across references
- Clear subject matter
- Works best with 2-4 images

### Style Selection
- **Realistic** - For product photos, portraits
- **3D Rendering** - For product visualizations
- **Minimalist** - For UI/UX mockups
- **Isometric** - For diagrams, infographics
- **Midjourney Weighted** - For best quality + control

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Plugin Not Loading
- Ensure `dist/` folder exists
- Check Figma Desktop App is latest version
- Verify manifest.json points to `dist/code.js` and `dist/ui.html`

### API Errors
- Verify API key is correct in `geminiService.ts`
- Check network access in manifest.json
- Ensure API key has quota available

### Images Not Generating
- Verify API key is correct (check welcome screen)
- Check browser console for errors (Dev Tools in Figma)
- Verify prompt is not empty
- Try with fewer images first (1-2)
- Check if content passes safety filters
- Clear session storage and re-enter API key: `sessionStorage.clear()`

## 📝 Customization

### Adding New Style Presets
Edit `src/constants/index.ts`:
```typescript
{
  id: 'my-style',
  name: 'My Custom Style',
  camera: '50mm f/2.8',
  lighting: 'Soft natural',
  aesthetic: 'Custom aesthetic',
  promptStructure: 'Your prompt template here, {prompt}, additional instructions'
}
```

### Changing Aspect Ratios
Edit `src/constants/index.ts` to add/modify ratios:
```typescript
{
  id: '21:9',
  label: '21:9',
  value: '21:9',
  width: 2560,
  height: 1080
}
```

### Adjusting Generation Limits
Edit constants in `src/constants/index.ts`:
```typescript
export const MAX_IMAGE_COUNT = 20;        // Change max images
export const MAX_CONCURRENT_REQUESTS = 3; // Change parallel requests
export const RETRY_ATTEMPTS = 3;          // Change retry count
```

## 🔐 Security Notes

- **API keys are stored securely** in browser session storage
- Keys are cleared when Figma is closed
- Keys are never sent to any third party servers
- All API calls go directly from your browser to Google Gemini API
- No backend server involved - completely client-side

## 📦 Dependencies

### Production
- React 19.x
- React DOM 19.x

### Development
- TypeScript 5.x
- Webpack 5.x
- Tailwind CSS 4.x
- PostCSS
- ESLint

## 🎓 Learning Resources

- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Google Gemini API](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

[Your License Here]

## 🤝 Contributing

Issues and pull requests are welcome!

---

**Created by Yosep Rendi** | Built with Figma Plugin API + Google Gemini
