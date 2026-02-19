import { Injectable } from '@angular/core';
import { PdfDocument, PdfPage, PdfLoadProgress } from '../models/pdf-document.model';
import { initializePdfJs, PDF_RENDER_OPTIONS } from '../config/pdf.config';
import * as pdfjs from 'pdfjs-dist';

interface PDFProgressData {
  loaded: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class PdfService {
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (!this.initialized) {
      initializePdfJs();
      this.initialized = true;
    }
  }

  async loadDocument(file: File, onProgress?: (progress: PdfLoadProgress) => void): Promise<PdfDocument> {
    const arrayBuffer = await file.arrayBuffer();
    
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      ...PDF_RENDER_OPTIONS,
    });

    if (onProgress) {
      loadingTask.onProgress = (progress: PDFProgressData) => {
        onProgress({
          loaded: progress.loaded,
          total: progress.total,
          percent: progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0,
        });
      };
    }

    const proxy = await loadingTask.promise;
    
    return {
      file,
      name: file.name,
      numPages: proxy.numPages,
      proxy,
    };
  }

  async getPage(document: PdfDocument, pageNumber: number): Promise<PdfPage> {
    const proxy = await document.proxy.getPage(pageNumber);
    const viewport = proxy.getViewport({ scale: 1 });

    return {
      pageNumber,
      proxy,
      width: viewport.width,
      height: viewport.height,
    };
  }

  async renderToCanvas(
    page: PdfPage,
    canvas: HTMLCanvasElement,
    scale: number = 1
  ): Promise<void> {
    const viewport = page.proxy.getViewport({ scale });
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Failed to get 2d context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };

    await page.proxy.render(renderContext).promise;
  }

  async renderPageToCanvas(
    document: PdfDocument,
    pageNumber: number,
    canvas: HTMLCanvasElement,
    scale: number = 1
  ): Promise<void> {
    const page = await this.getPage(document, pageNumber);
    await this.renderToCanvas(page, canvas, scale);
  }
}
