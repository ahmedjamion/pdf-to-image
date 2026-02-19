import { Injectable } from '@angular/core';
import { DownloadItem, ZipDownloadOptions } from '../models/download-item.model';
import JSZip from 'jszip';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  async downloadBlob(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async downloadSingle(item: DownloadItem): Promise<void> {
    const extension = this.getExtension(item.filename);
    const filename = `page-${item.pageNumber}.${extension}`;
    await this.downloadBlob(item.blob, filename);
  }

  async downloadZip(options: ZipDownloadOptions): Promise<void> {
    const zip = new JSZip();
    
    for (const item of options.images) {
      const extension = this.getExtension(item.filename);
      const filename = `page-${item.pageNumber}.${extension}`;
      zip.file(filename, item.blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    await this.downloadBlob(content, options.filename);
  }

  private getExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : 'png';
  }
}
