# 🔍 Debug Guide - Base64 Decode Error

**Error:** `Failed to decode base64 data - invalid base64 string`  
**Status:** Enhanced logging added to identify root cause  
**Build:** v2.1 with comprehensive API response debugging

---

## 🎯 **The Error**

```
❌ ASSETO: Base64 decode error: TypeError
❌ ASSETO: Insert error: Error
    message: "Failed to decode base64 data - invalid base64 string"
```

**What this means:**
- API request completed successfully (no network error)
- Data reached plugin code
- But `atob()` failed to decode base64 string

**Possible causes:**
1. API returned error message instead of image
2. Base64 data is corrupted or incomplete
3. Response format is not what we expect
4. API key is invalid or expired

---

## 🔬 **New Debugging Logs Added**

### 1. **API Response Structure Check**

```javascript
console.log('🔍 API Response structure:', {
  hasCandidates: !!data.candidates,
  candidatesLength: data.candidates?.length,
  firstCandidate: data.candidates?.[0] ? 'exists' : 'missing'
});
```

**What to look for:**
- `hasCandidates: true` ✅ - API returned candidates
- `candidatesLength: 1` ✅ - Got 1 image
- `firstCandidate: 'exists'` ✅ - Candidate has data

**If false:** API returned error or unexpected format

---

### 2. **Content Parts Analysis**

```javascript
console.log('🔍 Content parts:', {
  hasParts: !!parts,
  partsLength: parts?.length,
  partTypes: parts?.map((p: any) => Object.keys(p))
});
```

**What to look for:**
- `hasParts: true` ✅ - Content has parts
- `partsLength: > 0` ✅ - Has content
- `partTypes: [['inlineData']]` ✅ - Correct structure

**If wrong:** Response structure changed or API error

---

### 3. **Base64 Data Validation**

```javascript
console.log('✅ Image data received:', {
  mimeType,
  dataLength: imageData.length,
  dataPrefix: imageData.substring(0, 50),
  dataIsString: typeof imageData === 'string',
  hasInvalidChars: /[^A-Za-z0-9+/=]/.test(imageData)
});
```

**What to look for:**
- `mimeType: 'image/png'` or `'image/jpeg'` ✅
- `dataLength: > 1000` ✅ - Sufficient data
- `dataPrefix: 'iVBORw0KGgo...'` ✅ - Looks like base64
- `dataIsString: true` ✅ - Correct type
- `hasInvalidChars: false` ✅ - Valid base64 chars only

**If has invalid chars:** Data is corrupted or not base64

---

### 4. **API Error Response**

```javascript
console.error('❌ API Request failed:', {
  status: response.status,
  statusText: response.statusText,
  errorData,
  errorMessage
});
```

**Common errors:**
- `400` - Invalid request (check API key, params)
- `401` - Unauthorized (API key invalid)
- `403` - Forbidden (API key lacks permissions)
- `429` - Quota exceeded (too many requests)
- `500` - Server error (temporary issue)

---

## 🧪 **How to Debug**

### Step 1: Restart Figma Completely

```bash
❌ Close ALL files
❌ Quit Figma (Cmd+Q)
⏳ Wait 3 seconds
✅ Reopen Figma
```

---

### Step 2: Open Console FIRST

```bash
1. Open Figma
2. Press Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows)
3. Click "Console" tab
4. Clear console (trash icon)
```

---

### Step 3: Test Generation

```bash
1. Plugins → Development → ASSETO AI Generate
2. Enter API key
3. Prompt: "A beautiful sunset over mountains"
4. Style: Cinematic
5. Aspect Ratio: 16:9
6. Count: 1
7. Click "Generate"
8. WATCH CONSOLE CAREFULLY
```

---

### Step 4: Analyze Console Output

**Expected SUCCESS sequence:**

```
🔍 API Response structure: {
  hasCandidates: true,
  candidatesLength: 1,
  firstCandidate: 'exists'
}

🔍 Content parts: {
  hasParts: true,
  partsLength: 1,
  partTypes: [['inlineData']]
}

✅ Image data received: {
  mimeType: 'image/png',
  dataLength: 125834,
  dataPrefix: 'iVBORw0KGgoAAAANSUhEUgAAB...',
  dataIsString: true,
  hasInvalidChars: false
}

✅ Image URL created, total length: 125890
```

**Expected FAILURE patterns:**

#### Pattern A: No Candidates

```
❌ No candidates in response: {
  error: { message: "Invalid API key" }
}
```

**Solution:** Check API key is correct Google AI Studio key (AIza...)

---

#### Pattern B: Wrong Structure

```
🔍 API Response structure: {
  hasCandidates: false,
  candidatesLength: 0
}
```

**Solution:** API returned error, check full error object in console

---

#### Pattern C: No Image Data

```
🔍 Content parts: {
  hasParts: true,
  partsLength: 1,
  partTypes: [['text']]  // ❌ Should be 'inlineData'
}
```

**Solution:** Model generated text instead of image (wrong endpoint?)

---

#### Pattern D: Invalid Base64

```
✅ Image data received: {
  dataLength: 150,
  dataPrefix: '{"error":"Invalid request"}',  // ❌ This is JSON!
  hasInvalidChars: true
}
```

**Solution:** API returned error message as "image" data

---

## 🔑 **API Key Verification**

### How to Get Correct API Key:

1. Go to: https://aistudio.google.com/apikey
2. Sign in with Google account
3. Click "Create API key" or use existing
4. Copy key starting with `AIza...`
5. Paste in plugin

**IMPORTANT:** Key must have access to:
- Gemini 2.0 Flash Image models
- Image generation API (not just text)

---

### Test Your API Key:

```bash
curl -X POST \
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-image:generateContent?key=YOUR_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "A simple red circle"
      }]
    }],
    "generationConfig": {
      "responseModalities": ["IMAGE"],
      "imageConfig": {
        "aspectRatio": "1:1"
      }
    }
  }'
```

**Expected:** JSON with `candidates[0].content.parts[0].inlineData.data` containing base64

**If error:** Key invalid or lacks permissions

---

## 🚨 **Common Issues & Solutions**

### Issue 1: "Invalid API key"

**Symptoms:**
```
❌ API Request failed: {
  status: 401,
  statusText: 'Unauthorized',
  errorMessage: 'API key not valid'
}
```

**Solution:**
1. Get new API key from https://aistudio.google.com/apikey
2. Ensure key starts with `AIza...`
3. Check no extra spaces when pasting

---

### Issue 2: "Quota exceeded"

**Symptoms:**
```
❌ API Request failed: {
  status: 429,
  errorMessage: 'Quota exceeded'
}
```

**Solution:**
1. Wait a few minutes
2. Check Google AI Studio quotas
3. Upgrade plan if needed
4. Or use different API key

---

### Issue 3: "Model not found"

**Symptoms:**
```
❌ API Request failed: {
  status: 404,
  errorMessage: 'Model not found: gemini-2.0-flash-image'
}
```

**Solution:**
1. Model might not be available in your region
2. Check Google AI Studio for available models
3. Try `gemini-2.5-flash-image` instead

---

### Issue 4: Data corrupted

**Symptoms:**
```
✅ Image data received: {
  dataLength: 50,
  hasInvalidChars: true,
  dataPrefix: 'error: something went wrong'
}
```

**Solution:**
- API returned error text instead of image
- Check console for full API error response
- Fix underlying issue (API key, quota, etc.)

---

### Issue 5: Safety filter blocked

**Symptoms:**
```
Content blocked by safety filter
```

**Solution:**
1. Try different prompt
2. Avoid sensitive content
3. Be more specific/descriptive

---

## 📊 **Debug Checklist**

Before reporting issue, verify:

- [ ] Figma restarted completely
- [ ] Console open and cleared
- [ ] API key is valid Google AI Studio key
- [ ] Copied full console output
- [ ] Checked API response structure logs
- [ ] Verified base64 data validation logs
- [ ] No network errors (check Network tab)
- [ ] Error message copied exactly

---

## 🆘 **If Still Failing**

Provide these details:

1. **Full console output** (all logs, copy-paste)
2. **API key format** (first 10 chars: `AIzaSyB...`)
3. **Prompt used** for generation
4. **Network tab** - Click request, copy Response
5. **Error pattern** - Which debug log shows the issue?

---

## 💡 **Next Steps After Fix**

Once you see successful logs:

```
✅ Image URL created, total length: 125890
```

Then test "Add to Project" button:

```
Expected console output:
🎯 ASSETO: INSERT-IMAGE message received
📦 ASSETO: Message data exists: true
🔍 ASSETO: Format check - PNG: true
✅ ASSETO: createImage() successful
🎉 ASSETO: Insert completed successfully
```

If image generates but won't insert, that's a DIFFERENT issue (see `FINAL_FIX_IMAGE_INSERT.md`)

---

**Updated:** 2025-12-12  
**Version:** v2.1 with enhanced API debugging
