import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

export interface PdfDocument {
  file: File;
  name: string;
  numPages: number;
  proxy: PDFDocumentProxy;
}

export interface PdfPage {
  pageNumber: number;
  proxy: PDFPageProxy;
  width: number;
  height: number;
}

export interface PdfLoadProgress {
  loaded: number;
  total: number;
  percent: number;
}
