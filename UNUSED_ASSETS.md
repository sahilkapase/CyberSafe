# Unused Assets Report

## Public Folder Image Audit

### Files in `/public` folder:
- favicon.ico (205 KB) - ✅ Used (browser icon)
- img1 (20 KB) - ❓ Not checked
- **img2.jpg (9 KB) - ❌ NOT USED**
- **img3.jpg (6 KB) - ❌ NOT USED**
- **img4.jpg (15 KB) - ❌ NOT USED**
- img5 (167 KB) - ❓ Not checked
- **img6.jpg (5 KB) - ❌ NOT USED**
- **img7.webp (108 KB) - ❌ NOT USED**
- placeholder.svg (3 KB) - ❓ Not checked
- robots.txt (174 B) - ✅ Used (SEO)

### Summary
**Total unused images**: 5 files (img2.jpg, img3.jpg, img4.jpg, img6.jpg, img7.webp)  
**Total wasted space**: ~143 KB

### Recommendation

**Option 1: Delete unused images** (Recommended for production)
```bash
cd d:/Desktop/major-project/CyberSafe/safe-haven-chat/public
Remove-Item img2.jpg, img3.jpg, img4.jpg, img6.jpg, img7.webp
```

**Option 2: Keep for future use**
- If you plan to use these images later, keep them
- They won't affect deployment (just slightly larger bundle)

### Impact
- ✅ Reduces deployment size
- ✅ Faster Vercel builds
- ✅ Cleaner project structure
- ⚠️ No functional impact (not used anyway)

### Decision
Do you want to:
1. Delete these unused images?
2. Keep them for future use?
