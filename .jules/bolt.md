## 2024-04-30 - Next.js Image Optimization
**Learning:** Found unoptimized standard `<img>` tags for high-resolution images (~260KB) causing unnecessary payload on load. Next.js applications shouldn't use `<img>` when `<Image>` from `next/image` is available, as it offers automatic resizing, compression (WebP/AVIF), and lazy loading.
**Action:** Always scan for `<img>` tags in Next.js codebases and convert them to `<Image>` tags with appropriate width/height to prevent layout shifts and reduce bandwidth.
