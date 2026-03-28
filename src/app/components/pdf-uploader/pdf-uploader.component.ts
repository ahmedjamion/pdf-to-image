import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { validatePdfFile } from '../../shared/utils/file.utils';
import { DropZoneDirective } from '../../shared/directives/drop-zone.directive';

@Component({
  selector: 'app-pdf-uploader',
  imports: [DropZoneDirective],
  templateUrl: './pdf-uploader.component.html',
  styleUrl: './pdf-uploader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfUploaderComponent {
  fileSelected = output<File>();
  error = signal<string | null>(null);
  isDragging = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  onFileDropped(file: File): void {
    this.processFile(file);
  }

  onDragOver(): void {
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  private processFile(file: File): void {
    this.error.set(null);
    const validation = validatePdfFile(file);

    if (!validation.valid) {
      this.error.set(validation.error || 'Invalid file');
      return;
    }

    this.fileSelected.emit(file);
  }
}
