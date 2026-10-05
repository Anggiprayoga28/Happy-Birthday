/**
 * Utility to remove black background from dark JPG butterfly/rose assets
 * for seamless blending as glowing transparent stickers
 */
export function makeImageTransparent(imgElement) {
  if (!imgElement) return;
  const src = imgElement.getAttribute("src") || "";
  if (src.toLowerCase().includes(".png") && !imgElement.classList.contains("force-transparent")) {
    return;
  }

  const process = () => {
    try {
      const canvas = document.createElement("canvas");
      const w = imgElement.naturalWidth || imgElement.width || 300;
      const h = imgElement.naturalHeight || imgElement.height || 300;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgElement, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      const isCamera = imgElement.classList.contains("camera-img");

      if (isCamera) {
        const camLeft = Math.floor(w * 0.08);
        const camRight = Math.floor(w * 0.92);
        const camTop = Math.floor(h * 0.22);
        const camBottom = Math.floor(h * 0.74);

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const p = (y * w + x) * 4;
            const r = data[p], g = data[p+1], b = data[p+2];
            const maxVal = Math.max(r, g, b);

            if (x < camLeft || x > camRight || y < camTop || y > camBottom) {
              data[p+3] = 0;
            } else if (
              (y < camTop + 35 || y > camBottom - 20 || x < camLeft + 35 || x > camRight - 35) &&
              maxVal < 45
            ) {
              data[p+3] = 0;
            } else {
              data[p+3] = 255;
            }
          }
        }
      } else {
        // Smooth luminance-based alpha keying for dark background removal
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2];
          const maxVal = Math.max(r, g, b);

          if (maxVal <= 22) {
            data[i+3] = 0;
          } else if (maxVal < 85) {
            const t = (maxVal - 22) / (85 - 22);
            data[i+3] = Math.round(255 * (t * t * (3 - 2 * t)));
          } else {
            data[i+3] = 255;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      imgElement.src = canvas.toDataURL("image/png");
    } catch (err) {
      console.warn("Could not process transparency for image:", err);
    }
  };

  if (imgElement.complete && imgElement.naturalWidth !== 0) {
    process();
  } else {
    imgElement.addEventListener("load", process, { once: true });
  }
}
