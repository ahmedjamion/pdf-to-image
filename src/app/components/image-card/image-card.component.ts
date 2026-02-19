import { ChangeDetectionStrategy, Component, input, output, effect, signal } from '@angular/core';
import { DownloadItem } from '../../models/download-item.model';

@Component({
  selector: 'app-image-card',
  imports: [],
  templateUrl: './image-card.component.html',
  styleUrl: './image-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCardComponent {
  image = input.required<DownloadItem>();
  download = output<DownloadItem>();

  imageUrl = signal<string>('');

  constructor() {
    effect(() => {
      const item = this.image();
      const url = URL.createObjectURL(item.blob);
      this.imageUrl.set(url);
    });
  }

  onDownload(): void {
    this.download.emit(this.image());
  }
}
