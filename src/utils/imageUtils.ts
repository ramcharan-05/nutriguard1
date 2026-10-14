export async function svgToPngDataUrl(svgDataUrl: string, width = 600, height = 750): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png', 0.95));
      } else {
        resolve(svgDataUrl);
      }
    };
    img.onerror = () => {
      resolve(svgDataUrl);
    };
    img.src = svgDataUrl;
  });
}

// Compress and scale down large camera/phone photos to max 1200px
export async function optimizeImageForVision(dataUrl: string, maxDimension = 1200): Promise<{ dataUrl: string; mimeType: string }> {
  // If it's already an SVG, leave it or rasterize
  if (dataUrl.startsWith('data:image/svg+xml')) {
    const png = await svgToPngDataUrl(dataUrl);
    return { dataUrl: png, mimeType: 'image/png' };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Only downscale if larger than maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        // High quality JPEG for rapid network transfer & optimal OCR
        const compressed = canvas.toDataURL('image/jpeg', 0.88);
        resolve({ dataUrl: compressed, mimeType: 'image/jpeg' });
      } else {
        resolve({ dataUrl, mimeType: 'image/jpeg' });
      }
    };

    img.onerror = () => {
      resolve({ dataUrl, mimeType: 'image/jpeg' });
    };

    img.src = dataUrl;
  });
}
