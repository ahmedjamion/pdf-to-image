import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PdfUploaderComponent } from './components/pdf-uploader/pdf-uploader.component';
import { ImageGridComponent } from './components/image-grid/image-grid.component';
import { DownloadControlsComponent } from './components/download-controls/download-controls.component';
import { PdfService } from './services/pdf.service';
import { ConversionService } from './services/conversion.service';
import { DownloadService } from './services/download.service';
import { StateService } from './services/state.service';
import { DownloadItem } from './models/download-item.model';
import { ConversionOptions } from './models/conversion-options.model';
import { createCanvas } from './shared/utils/canvas.utils';
import { removeFileExtension } from './shared/utils/file.utils';

@Component({
  selector: 'app-root',
  imports: [PdfUploaderComponent, ImageGridComponent, DownloadControlsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private pdfService = inject(PdfService);
  private conversionService = inject(ConversionService);
  private downloadService = inject(DownloadService);
  stateService = inject(StateService);

  pdfDocument = this.stateService.pdfDocument;
  convertedImages = this.stateService.convertedImages;
  isLoading = this.stateService.isLoading;
  isConverting = this.stateService.isConverting;
  isCompleted = this.stateService.isCompleted;
  hasPdf = this.stateService.hasPdf;
  hasImages = this.stateService.hasImages;
  error = this.stateService.error;

  conversionOptions = signal<ConversionOptions>({
    format: 'jpeg',
    quality: 1,
    scale: 1,
  });

  async onFileSelected(file: File): Promise<void> {
    this.stateService.setLoading();

    try {
      const doc = await this.pdfService.loadDocument(file);
      this.stateService.setReady(doc);
      await this.convertToImages();
    } catch (err) {
      this.stateService.setError('Failed to load PDF. Please try again.');
      console.error(err);
    }
  }

  async convertToImages(): Promise<void> {
    const doc = this.pdfDocument();
    if (!doc) return;

    this.stateService.setConverting();

    try {
      const canvases: HTMLCanvasElement[] = [];
      const numPages = doc.numPages;
      const scale = this.conversionOptions().scale;

      for (let i = 1; i <= numPages; i++) {
        const canvas = createCanvas(0, 0);
        await this.pdfService.renderPageToCanvas(doc, i, canvas, scale);
        canvases.push(canvas);
      }

      const blobs = await this.conversionService.convertAllPages(
        canvases,
        this.conversionOptions(),
      );

      const items: DownloadItem[] = blobs.map((blob, index) => ({
        id: `page-${index + 1}`,
        pageNumber: index + 1,
        blob,
        filename: `${removeFileExtension(doc.name)}.${this.conversionOptions().format}`,
        status: 'completed',
      }));

      this.stateService.setCompleted(items);
    } catch (err) {
      this.stateService.setError('Failed to convert PDF. Please try again.');
      console.error(err);
    }
  }

  async downloadSingle(image: DownloadItem): Promise<void> {
    await this.downloadService.downloadSingle(image);
  }

  async downloadAll(): Promise<void> {
    const doc = this.pdfDocument();
    if (!doc) return;

    await this.downloadService.downloadZip({
      filename: `${removeFileExtension(doc.name)}-images.zip`,
      images: this.convertedImages(),
    });
  }

  reset(): void {
    this.stateService.reset();
  }

  onFormatChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.conversionOptions.update((opt) => ({
      ...opt,
      format: select.value as 'png' | 'jpeg' | 'webp',
    }));
    this.convertToImages();
  }

  onScaleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.conversionOptions.update((opt) => ({ ...opt, scale: +select.value }));
    this.convertToImages();
  }
}
