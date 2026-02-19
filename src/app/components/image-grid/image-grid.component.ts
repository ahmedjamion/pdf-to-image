import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DownloadItem } from '../../models/download-item.model';
import { ImageCardComponent } from '../image-card/image-card.component';

@Component({
  selector: 'app-image-grid',
  imports: [ImageCardComponent],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGridComponent {
  images = input.required<DownloadItem[]>();
  downloadSingle = output<DownloadItem>();

  onDownload(item: DownloadItem): void {
    this.downloadSingle.emit(item);
  }
}
