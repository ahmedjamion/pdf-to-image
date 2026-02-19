export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function canvasToDataUrl(canvas: HTMLCanvasElement, format: string = 'image/png', quality: number = 1): string {
  return canvas.toDataURL(format, quality);
}

export function clearCanvas(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext('2d');
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export function getCanvasDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
  
  if (ratio >= 1) {
    return { width: originalWidth, height: originalHeight };
  }
  
  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio),
  };
}
