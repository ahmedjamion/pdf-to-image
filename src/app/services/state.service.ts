import { Injectable, signal, computed } from '@angular/core';
import { PdfDocument } from '../models/pdf-document.model';
import { ConversionOptions, DEFAULT_CONVERSION_OPTIONS } from '../models/conversion-options.model';
import { DownloadItem } from '../models/download-item.model';

export type AppState = 'idle' | 'loading' | 'ready' | 'converting' | 'completed' | 'error';

@Injectable({ providedIn: 'root' })
export class StateService {
  readonly state = signal<AppState>('idle');
  readonly error = signal<string | null>(null);
  
  readonly pdfDocument = signal<PdfDocument | null>(null);
  readonly conversionOptions = signal<ConversionOptions>(DEFAULT_CONVERSION_OPTIONS);
  readonly convertedImages = signal<DownloadItem[]>([]);
  
  readonly isLoading = computed(() => this.state() === 'loading');
  readonly isConverting = computed(() => this.state() === 'converting');
  readonly isCompleted = computed(() => this.state() === 'completed');
  readonly hasPdf = computed(() => this.pdfDocument() !== null);
  readonly hasImages = computed(() => this.convertedImages().length > 0);
  readonly pageCount = computed(() => this.pdfDocument()?.numPages ?? 0);

  setLoading(): void {
    this.state.set('loading');
    this.error.set(null);
  }

  setReady(document: PdfDocument): void {
    this.pdfDocument.set(document);
    this.state.set('ready');
    this.error.set(null);
  }

  setConverting(): void {
    this.state.set('converting');
    this.error.set(null);
  }

  setCompleted(images: DownloadItem[]): void {
    this.convertedImages.set(images);
    this.state.set('completed');
    this.error.set(null);
  }

  setError(message: string): void {
    this.error.set(message);
    this.state.set('error');
  }

  reset(): void {
    this.state.set('idle');
    this.error.set(null);
    this.pdfDocument.set(null);
    this.convertedImages.set([]);
  }

  updateOptions(options: Partial<ConversionOptions>): void {
    this.conversionOptions.update((current) => ({ ...current, ...options }));
  }
}
