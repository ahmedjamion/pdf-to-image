import * as pdfjs from 'pdfjs-dist';

export const PDF_RENDER_OPTIONS = {
  cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/cmaps/',
  cMapPacked: true,
  enableXfa: true,
};

export function initializePdfJs(): void {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdf.worker.min.mjs', document.baseURI).toString();
}
