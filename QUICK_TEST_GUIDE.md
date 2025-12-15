# 🚀 Quick Test Guide - Image Insert Fix

**Fix Version:** v2.2 - UI-Side Base64 Decoding  
**Status:** ✅ Ready to test  
**Architecture:** NEW - Base64 decode happens in UI, not plugin  

---

## ⚡ **Quick Start (5 Minutes)**

### 1️⃣ **RESTART FIGMA (CRITICAL!)**

```bash
❌ Close ALL Figma files
❌ Quit Figma Desktop app completely  
✅ Restart Figma
✅ Open any file (new or existing)
```

**Why?** Old plugin code cached in memory - restart loads new build.

---

### 2️⃣ **Open Plugin & DevTools**

```bash
✅ Plugins → Development → ASSETO AI Generate
✅ Press Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows)
✅ Click "Console" tab in DevTools
```

---

### 3️⃣ **Generate & Insert Test**

**Prompt:** `A beautiful sunset over mountains`  
**Style:** Cinematic  
**Aspect Ratio:** 16:9  
**Count:** 1  

1. Fill in your API key (Google AI Studio key)
2. Click "Generate"
3. Wait for image to appear in gallery
4. Click **"Add to Project"** button
5. **Watch the console logs!**

---

## ✅ **Expected: SUCCESS Case**

### Console Output Should Show:

**UI Console (Browser):**
```
🚀 ASSETO UI: Starting insert process
📸 ASSETO UI: Image URL length: 125890
🔍 ASSETO UI: Base64 data length: 125834
✅ ASSETO UI: Base64 decoded, binary length: 94350
✅ ASSETO UI: Uint8Array created, length: 94350
✅ ASSETO UI: First 10 bytes: [137,80,78,71,13,10,26,10,0,0]
🔍 ASSETO UI: Format check - PNG: true, JPEG: false, GIF: false
✅ ASSETO UI: Image bytes sent to plugin
```

**Plugin Console (Figma):**
```
🎯 ASSETO: INSERT-IMAGE message received
📦 ASSETO: Message data exists: true
📦 ASSETO: Image bytes array length: 94350
✅ ASSETO: Uint8Array recreated, length: 94350
✅ ASSETO: First 10 bytes: [137,80,78,71,13,10,26,10,0,0]
🔍 ASSETO: Format check - PNG: true, JPEG: false, GIF: false
✅ ASSETO: createImage() successful
✅ ASSETO: Image hash: 1234567890abcdef...
✅ ASSETO: Rectangle created, size: 1024
✅ ASSETO: Image fill applied to rectangle
📍 ASSETO: Position set: 500, 300
✅ ASSETO: Added to page
✅ ASSETO: Selected and zoomed
🎉 ASSETO: Insert completed successfully
```

### Canvas Should Show:

- ✅ Image appears at 1024x1024 pixels
- ✅ Centered in viewport
- ✅ Selected (blue outline)
- ✅ Named "AI Generated Image" in layers panel
- ✅ Green notification: "✅ Image inserted successfully!"

---

## ❌ **If Something Goes Wrong**

### Error Pattern 1: Base64 Decode Error (v2.2 NEW)

**NEW in v2.2:** Base64 decode now happens in **UI side**, NOT plugin!

**UI Console Shows:**
```
❌ ASSETO UI: atob failed: InvalidCharacterError
Failed to prepare image: Failed to decode base64 - data may be corrupted
```

**What it means:**
- API returned something that's NOT a valid image
- Could be error message, corrupted data, or wrong API key

**Debug Steps:**
1. Look for API response logs FIRST:
```
🔍 API Response structure: { ... }
🔍 Content parts: { ... }
✅ Image data received: { ... }
```

2. Then check UI decode logs:
```
🚀 ASSETO UI: Starting insert process
🔍 ASSETO UI: Base64 data length: XXX
```

3. Check what logs show:
   - If **"No candidates"** in API logs → API error (check API key/quota)
   - If **"hasInvalidChars: true"** → Data corrupted (not base64)
   - If **"atob failed"** in UI → Browser couldn't decode (invalid base64)

**Solutions:**
- Verify API key is correct: https://aistudio.google.com/apikey
- Check API key format: Should start with `AIza...`
- Check quota: Too many requests? Wait a few minutes
- See `DEBUG_BASE64_ERROR.md` for detailed guide
- **NEW:** See `ARCHITECTURE_IMPROVEMENT.md` for v2.2 changes

---

### Error Pattern 2: No Console Logs

**Symptoms:**
- Click "Add to Project" but nothing happens
- No console logs appear
- No error notification

**Solution:**
1. **Restart Figma completely** (most common cause)
2. Verify plugin loaded: Check Plugins menu
3. Try closing and reopening DevTools

---

### Error Pattern 3: Format Error

**Console Shows:**
```
🔍 ASSETO: Format check - PNG: false, JPEG: false, GIF: false
🔍 ASSETO: First 4 bytes: [123, 34, 101, 114]
❌ Unsupported image format. First bytes: 123, 34, 101, 114
```

**What it means:**
- API returned text/JSON instead of image
- First bytes `[123, 34, ...]` = `{"er...` (JSON error response)

**Solution:**
1. Check API key is valid
2. Check internet connection
3. Try regenerating image
4. Check Nano Banana API status

---

### Error Pattern 4: Base64 Decode in Plugin Code

**Console Shows:**
```
❌ ASSETO: Base64 decode error: InvalidCharacterError
❌ Failed to decode base64 data - invalid base64 string
```

**What it means:**
- Base64 data is corrupted or incomplete
- API response was truncated

**Solution:**
1. Regenerate image
2. Check API response in Network tab
3. Verify API is returning complete base64 string

---

### Error Pattern 5: createImage() Failed

**Console Shows:**
```
✅ ASSETO: Uint8Array created, length: 94350
❌ ASSETO: createImage() failed: Error: Image is too large
```

**What it means:**
- Image dimensions > 4096x4096 pixels
- Image file > 50MB

**Solution:**
1. Check generation config (should be max 2048x2048)
2. Regenerate with smaller size

---

## 🔍 **Debug Checklist**

If insert fails, check these in order:

### Step 1: Message Received?
```
Look for: "🎯 ASSETO: INSERT-IMAGE message received"
```
- ✅ **YES** → Go to Step 2
- ❌ **NO** → UI-to-plugin communication broken
  - Restart Figma
  - Check manifest.json network permissions

### Step 2: Base64 Data Valid?
```
Look for: "📊 ASSETO: Base64 data length: [number]"
```
- ✅ **>0** → Go to Step 3
- ❌ **0 or error** → API response invalid
  - Check API key
  - Check API response in Network tab

### Step 3: Format Recognized?
```
Look for: "🔍 ASSETO: Format check - PNG: true"
OR "JPEG: true" OR "GIF: true"
```
- ✅ **One is true** → Go to Step 4
- ❌ **All false** → Not an image file
  - Check what API returned (probably JSON error)

### Step 4: createImage() Success?
```
Look for: "✅ ASSETO: createImage() successful"
```
- ✅ **YES** → Go to Step 5
- ❌ **NO** → Image data invalid
  - Check error message for specific reason
  - Verify first bytes match PNG/JPEG/GIF signature

### Step 5: Fills Applied?
```
Look for: "✅ ASSETO: Image fill applied to rectangle"
```
- ✅ **YES** → Should see image on canvas
- ❌ **NO** → Image hash invalid
  - Check "Image hash:" log
  - Try regenerating

### Step 6: Image Visible?
```
Look at Figma canvas
```
- ✅ **YES** → 🎉 SUCCESS!
- ❌ **NO but no error** → Possible Figma rendering issue
  - Try zooming out/in
  - Check layers panel for "AI Generated Image"
  - Try selecting it manually

---

## 📸 **Test Multiple Cases**

### Test 1: Different Styles
- Generate with: Cinematic, Photorealistic, Anime
- All should insert successfully

### Test 2: Different Aspect Ratios
- Generate: 1:1, 16:9, 9:16, 4:3, 3:4
- All should insert successfully

### Test 3: Multiple Images
- Generate 3 images at once
- Click "Add to Project" on each
- All should insert successfully

### Test 4: With Reference Image
- Upload reference image
- Generate with reference style
- Should insert successfully

---

## 💡 **Pro Tips**

### Tip 1: Keep Console Open
Always have DevTools console open when testing - makes debugging instant.

### Tip 2: Check Byte Signatures
If format error occurs, check the first 4 bytes:
- **[137, 80, 78, 71]** = PNG ✅
- **[255, 216, 255, ...]** = JPEG ✅
- **[71, 73, 70, ...]** = GIF ✅
- **[123, 34, ...]** = JSON (error response) ❌

### Tip 3: Verify API Response
If issues persist, check Network tab:
1. Filter by "generativelanguage.googleapis.com"
2. Click the API request
3. Check Response tab
4. Verify it starts with "data:image/png;base64,..."

---

## 📊 **Success Metrics**

Plugin is working correctly if:
- ✅ Console shows all validation steps passing
- ✅ No errors in console
- ✅ Image appears on canvas within 1 second
- ✅ Image is properly sized and positioned
- ✅ Success notification shows
- ✅ Works for all styles and aspect ratios
- ✅ Works with and without reference images

---

## 🆘 **Need Help?**

If tests fail:

1. **Copy console logs** (all of them)
2. **Copy error message** (from notification)
3. **Screenshot** (if image partially works)
4. **Share:** Test case that failed

**Most likely issue:** Forgot to restart Figma completely! 🔄

---

**Ready to test? Follow steps 1-3 above! 🚀**
