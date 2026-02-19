import { Injectable } from '@angular/core';
import { ConversionOptions, ConversionProgress, DEFAULT_CONVERSION_OPTIONS } from '../models/conversion-options.model';

@Injectable({ providedIn: 'root' })
export class ConversionService {
  async convertCanvasToBlob(
    canvas: HTMLCanvasElement,
    options: ConversionOptions = DEFAULT_CONVERSION_OPTIONS
  ): Promise<Blob> {
    const mimeType = this.getMimeType(options.format);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        mimeType,
        options.quality
      );
    });
  }

  async convertAllPages(
    pages: HTMLCanvasElement[],
    options: ConversionOptions = DEFAULT_CONVERSION_OPTIONS,
    onProgress?: (progress: ConversionProgress) => void
  ): Promise<Blob[]> {
    const results: Blob[] = [];
    const total = pages.length;

    for (let i = 0; i < pages.length; i++) {
      const blob = await this.convertCanvasToBlob(pages[i], options);
      results.push(blob);

      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          percent: Math.round(((i + 1) / total) * 100),
        });
      }
    }

    return results;
  }

  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
    };
    return mimeTypes[format] || 'image/png';
  }
}
