# ASSETO AI Generate

**Generate stunning AI images directly in Figma using Google's Gemini AI**

![Version](https://img.shields.io/badge/version-2.8.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Figma](https://img.shields.io/badge/Figma-Plugin-purple)

---

## 🎨 Overview

ASSETO AI Generate is a powerful Figma plugin that brings AI image generation directly into your design workflow. Using Google's advanced Gemini AI technology, you can create professional, high-quality images from simple text descriptions.

### Key Features

- 🎯 **11 Style Presets** - From realistic photos to anime, 3D renders to pixel art
- ✨ **Custom Style Input** - Describe any style you want
- 📐 **Flexible Dimensions** - 5 preset ratios + custom dimensions (256-2048px)
- 🖼️ **Batch Generation** - Create 1-20 images at once
- 🔍 **Image Viewer** - Full zoom and pan controls with keyboard shortcuts
- 📋 **Quick Copy** - Copy images to clipboard with one click
- 🎯 **Bulk Insert** - Insert multiple images to canvas in grid layout
- 🚫 **No Text in Images** - All presets optimized to avoid text generation
- 🎨 **Clean UI** - Minimalist black & white design

---

## 🚀 Quick Start

### 1. Get Google AI API Key

**Required:** You need a free Google AI Studio API key to use this plugin.

1. Visit: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza`)

**Free Tier:**
- 1,500 requests per day
- Completely free
- No credit card required

### 2. Install Plugin

**From Figma Community:**
1. Search "ASSETO AI Generate" in Figma Community
2. Click "Install"
3. Open the plugin from menu

**For Development:**
```bash
# Clone repository
git clone https://github.com/yoseprendi/asseto-ai-generate.git
cd asseto-ai-generate

# Install dependencies
npm install

# Build plugin
npm run build

# Import to Figma
# Menu → Plugins → Development → Import plugin from manifest
# Select manifest.json from this directory
```

### 3. First Use

1. **Open Plugin:** Menu → Plugins → ASSETO AI Generate
2. **Enter API Key:** Paste your Google AI API key
3. **Start Generating:** Enter a prompt and click generate!

---

## 📖 Usage Guide

### Basic Workflow

```
1. Enter prompt (e.g., "sunset over mountains")
2. Select style (e.g., "Realistic")
3. Choose aspect ratio (e.g., "16:9")
4. Set image count (1-20)
5. Click "GENERATE X IMAGES"
6. Wait for generation (~3-5 seconds per image)
7. Click image to insert to canvas
```

### Style Presets

| Style | Description | Best For |
|-------|-------------|----------|
| **No Style** | Natural, no artistic filters | General purpose |
| **Realistic** | Professional photography | Product shots, portraits |
| **Model Pro** | Magazine-quality photoshoot | Fashion, editorial |
| **3D Rendering** | Ray-traced 3D visualization | Product mockups |
| **Illustration** | Minimalist vector style | Icons, graphics |
| **Abstract Modern** | Contemporary art | Backgrounds, art |
| **Isometric 3D** | Technical isometric view | Diagrams, infographics |
| **Claymorphism** | 3D clay texture style | UI elements, playful |
| **Futuristic** | Cyberpunk neon aesthetic | Sci-fi, tech |
| **Midjourney ✨** | High-detail premium quality | Professional work |
| **Custom Style** | Your own style description | Any unique style |

### Custom Styles

Describe any style you want:

```
Examples:
- "Anime Style"
- "Retro 80s"
- "8 Bit Pixel Art"
- "Watercolor Painting"
- "Comic Book Style"
- "Oil Painting"
- "Vintage Poster"
```

### Aspect Ratios

```
16:9    → 1024×576   (Landscape, headers)
4:3     → 1024×768   (Classic photos)
1:1     → 1024×1024  (Social media, avatars)
3:4     → 768×1024   (Portrait photos)
9:16    → 576×1024   (Stories, mobile)
Custom  → 256-2048px (Any custom size)
```

### Advanced Features

**Image Viewer:**
- Click any image to open full-size viewer
- Zoom: Scroll wheel, +/- buttons, or keyboard
- Pan: Click and drag when zoomed
- Keyboard shortcuts: `+`, `-`, `0`, `Esc`

**Copy to Clipboard:**
- Hover over image
- Click copy icon
- Paste anywhere (Figma, Photoshop, etc.)

**Bulk Insert:**
- Select multiple images (checkbox)
- Click "Add All to Design"
- Images inserted in 10-column grid

**Reference Images:**
- Click "Click to Add Reference Image"
- Upload up to 4 reference images
- AI analyzes style, colors, and mood
- Applies similar style to generated images

---

## 🎯 Example Prompts

### Realistic Photos
```
"Modern minimalist living room with plants"
"Professional businessman in office"
"Fresh vegetables on wooden table"
"Mountain landscape at sunrise"
```

### 3D & Renders
```
"Modern chair product render"
"Futuristic smartphone 3D visualization"
"Isometric city block illustration"
"Clay texture 3D objects"
```

### Art & Illustration
```
"Abstract fluid shapes with vibrant colors"
"Cute cat illustration in minimalist style"
"Cyberpunk city at night with neon lights"
"Watercolor landscape painting"
```

### Custom Styles
```
Style: "Anime Style" + Prompt: "girl with blue hair"
Style: "Retro 80s" + Prompt: "sports car on highway"
Style: "8 Bit" + Prompt: "forest with trees"
Style: "Comic Book" + Prompt: "superhero flying"
```

---

## ⚙️ Development

### Prerequisites

- Node.js 16+
- npm or yarn
- Figma Desktop App

### Setup

```bash
# Install dependencies
npm install

# Development mode (watch)
npm run dev

# Production build
npm run build

# Type check
npx tsc --noEmit
```

### Project Structure

```
Asseto/
├── src/
│   ├── components/        # React components
│   │   ├── AIGenerateTab.tsx
│   │   ├── Gallery.tsx
│   │   ├── ImageViewerModal.tsx
│   │   ├── APIKeySetup.tsx
│   │   └── ui/            # shadcn/ui components
│   ├── constants/         # Style presets, ratios
│   ├── types/             # TypeScript types
│   ├── utils/             # API functions
│   ├── services/          # Gemini API service
│   └── styles.css         # Global styles
├── code.ts                # Figma plugin code
├── manifest.json          # Plugin manifest
├── dist/                  # Built files
│   ├── ui.html           # UI bundle (345 KB)
│   └── code.js           # Plugin code (4.16 KB)
└── docs/                  # Documentation
```

### Tech Stack

- **Frontend:** React 18.2, TypeScript 5.3
- **Styling:** Tailwind CSS 3.4, shadcn/ui
- **Build:** Webpack 5
- **API:** Google Gemini 2.5 Flash Image

---

## 📋 Troubleshooting

### "Invalid API Key" Error

**Solutions:**
1. Verify key at: https://aistudio.google.com/app/apikey
2. Check for extra spaces when pasting
3. Ensure key starts with `AIza`
4. Create new API key if expired

### Images Not Generating

**Check:**
1. Internet connection (plugin requires online)
2. API quota (free tier: 1,500/day)
3. API key validity
4. Console errors (Cmd+Option+I)

### Generation is Slow

**Expected Times:**
- 1 image: 3-5 seconds
- 5 images: 15-25 seconds
- 10 images: 30-50 seconds
- 20 images: 1-2 minutes

**If Slower:**
- Check internet speed
- Reduce image count
- Try different time of day

### "You are offline" Message

**Solution:**
- Check internet connection
- Plugin requires online connection
- Cannot generate images offline

---

## 📞 Support

**Email:** support.asseto@gmail.com  
**Response Time:** Within 48 hours

**Documentation:** [Full Documentation](https://github.com/yoseprendi/asseto-ai-generate/blob/main/DOCUMENTATION_FINAL.md)  
**Privacy Policy:** [Privacy Policy](https://github.com/yoseprendi/asseto-ai-generate/blob/main/PRIVACY_POLICY.md)  
**Report Issues:** [GitHub Issues](https://github.com/yoseprendi/asseto-ai-generate/issues)

---

## 🔒 Privacy & Security

- **API Key:** Stored locally (Figma client storage only)
- **Prompts:** Not stored, sent only to Google AI
- **Images:** Not retained, temporary display only
- **No Tracking:** No analytics, cookies, or data collection

Read our full [Privacy Policy](PRIVACY_POLICY.md)

---

## 📄 License

MIT License - Free to use, modify, and distribute.

---

## 🙏 Acknowledgments

**Technologies:**
- Google Gemini 2.5 Flash Image API
- Figma Plugin API
- React & TypeScript
- Tailwind CSS
- shadcn/ui

**Not Affiliated With:**
- Figma, Inc.
- Google LLC

---

## 🎉 Version History

**v2.8.0** (Current) - API Key Setup Improvements
- Loading state on plugin start
- Enhanced validation (3-step check)
- Auto-focus input field
- Enter key support
- Offline detection
- Support contact added

**v2.7.0** - UI Cleanup & Style Optimization
- Header removed (more space)
- "No Style" added as default
- Custom style prompt optimized
- Helper text added

**v2.6.1** - Prompt & UI Fixes
- All presets avoid text in images
- Custom style format corrected
- UI colors: black/white scheme
- Light theme forced

**v2.6.0** - Complete Feature Set
- Custom style preset
- Custom dimensions
- Image viewer with zoom
- Copy to clipboard
- 8 major features

See full [Version History](DOCUMENTATION_FINAL.md#version-history)

---

## ⭐ Star History

If you find this plugin useful, please give it a star! ⭐

---

**Created by [Yosep Rendi](https://github.com/yosrend) (x.com/yoseprendi)**  

**Version:** 2.8.0  
**Last Updated:** December 13, 2025

---

**Ready to generate amazing AI images? Install now and start creating! 🚀**
