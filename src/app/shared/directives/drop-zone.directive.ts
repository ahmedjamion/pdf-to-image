import { Directive, EventEmitter, Output, Input } from '@angular/core';

@Directive({
  selector: '[appDropZone]',
  standalone: true,
  host: {
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class DropZoneDirective {
  @Input() accept: string | string[] = [];
  @Input() maxSize: number = 50 * 1024 * 1024;
  @Output() fileDropped = new EventEmitter<File>();

  private get acceptTypes(): string[] {
    if (Array.isArray(this.accept)) {
      return this.accept;
    }
    return this.accept ? [this.accept] : [];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFile(file)) {
        this.fileDropped.emit(file);
      }
    }
  }

  private isValidFile(file: File): boolean {
    const types = this.acceptTypes;
    if (types.length > 0) {
      if (!types.includes(file.type)) {
        return false;
      }
    }

    if (this.maxSize > 0 && file.size > this.maxSize) {
      return false;
    }

    return true;
  }
}
