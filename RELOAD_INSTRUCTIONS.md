# 🔄 How to Reload Plugin After Code Changes

**CRITICAL:** Figma caches plugin code in memory. You **MUST** restart Figma to load new code.

---

## ✅ **Correct Way to Reload**

### Method 1: Complete Restart (RECOMMENDED)

```bash
1. ❌ Close ALL open Figma files
2. ❌ Quit Figma Desktop app completely
   - Mac: Cmd+Q or Figma → Quit
   - Windows: Alt+F4 or File → Exit
3. ⏳ Wait 2-3 seconds (ensure process fully exits)
4. ✅ Open Figma Desktop again
5. ✅ Open any file
6. ✅ Plugins → Development → ASSETO AI Generate
```

**Why this works:** Completely clears all cached code from memory.

---

### Method 2: Reload Plugin Only (Sometimes Works)

```bash
1. In plugin window: Right-click anywhere
2. Select "Reload Plugin"
3. OR: Close plugin window and reopen
```

**Why this might not work:** Main process cache may not clear.

**If Method 2 fails:** Use Method 1 (complete restart).

---

## ❌ **What DOESN'T Work**

### ❌ Just closing plugin window
```
Close [X] → Reopen Plugin
```
**Problem:** Code still cached, old version runs.

### ❌ Running build again without restart
```
npm run build → Open Plugin
```
**Problem:** New build exists, but Figma uses cached old version.

### ❌ Switching files
```
Close File A → Open File B → Open Plugin
```
**Problem:** Cache is per-app, not per-file.

---

## 🔍 **How to Verify You're Running New Code**

### Check 1: Console Logs Changed?

**Old code might log:**
```
🚀 ASSETO: Sending message
```

**New code logs:**
```
🎯 ASSETO: INSERT-IMAGE message received
📦 ASSETO: Message data exists: true
🔍 ASSETO: Format check - PNG: true
```

If you see old logs → **Restart Figma!**

---

### Check 2: New Features Working?

If you added new validation but it's not catching errors → **Restart Figma!**

---

### Check 3: Build Timestamp

Check `dist/code.js` modification time:
```bash
ls -lh dist/code.js
```

If modified **after** you opened Figma → **Restart Figma!**

---

## 📋 **Full Testing Workflow**

### Step-by-Step (No Mistakes)

```bash
# 1. Make code changes
vim code.ts  # (or VSCode)

# 2. Build
npm run build
# Wait for: "webpack 5.x compiled with X warnings"

# 3. VERIFY BUILD SUCCEEDED
ls -lh dist/code.js
# Should show recent timestamp

# 4. RESTART FIGMA (CRITICAL!)
❌ Close ALL files
❌ Quit Figma (Cmd+Q / Alt+F4)
⏳ Wait 3 seconds
✅ Reopen Figma

# 5. Open DevTools FIRST
Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows)
→ Console tab

# 6. Open plugin
Plugins → Development → ASSETO AI Generate

# 7. Test
Generate image → Add to Project
Watch console logs!

# 8. Verify new code running
Look for new console logs you added
```

---

## 🐛 **Common Mistakes**

### Mistake 1: "I built but it's not working!"

**What happened:** Forgot to restart Figma  
**Fix:** Complete restart (Method 1)

---

### Mistake 2: "Console shows old logs!"

**What happened:** Figma cached old code  
**Fix:** Complete restart (Method 1)  
**Extra:** Clear browser cache if in browser version

---

### Mistake 3: "Reloaded plugin but still broken!"

**What happened:** Plugin-level reload didn't clear main process cache  
**Fix:** Complete restart (Method 1)

---

### Mistake 4: "Built new version but Figma crashes!"

**What happened:** Syntax error or broken code  
**Fix:**
1. Check build output for errors
2. Fix syntax errors
3. Rebuild
4. Restart Figma

---

## ⚡ **Quick Reference**

**After ANY code change:**
```
1. npm run build
2. Quit Figma completely
3. Reopen Figma
4. Open plugin
5. Test
```

**If unsure:**
```
Always do complete restart!
```

**First thing to try when debugging:**
```
Restart Figma!
```

---

## 💡 **Pro Tip: Development Workflow**

To minimize restarts, batch your changes:

```bash
# ❌ BAD: Restart after each change
Change A → Build → Restart → Test
Change B → Build → Restart → Test
Change C → Build → Restart → Test

# ✅ GOOD: Batch changes together
Change A + B + C → Build → Restart → Test all
```

But don't batch too much! If something breaks, you won't know which change caused it.

**Sweet spot:** 2-3 related changes per restart.

---

## 🆘 **Still Not Working?**

If you've done complete restart and new code still not running:

### Check 1: Is dist/code.js actually updated?
```bash
cat dist/code.js | grep "ASSETO"
# Should see your new console.log messages
```

### Check 2: Is manifest pointing to correct file?
```json
// manifest.json
{
  "main": "dist/code.js",  // ← Should point to dist/code.js
  "ui": "dist/ui.html"     // ← Should point to dist/ui.html
}
```

### Check 3: Build errors?
```bash
npm run build
# Look for "ERROR" in output
# Even if it says "compiled with warnings", check for errors
```

### Check 4: TypeScript errors?
```bash
npx tsc --noEmit
# Should show "no errors"
```

---

**Remember: When in doubt, restart Figma! 🔄**

It's the #1 solution to 90% of "my code changes aren't working" issues.
