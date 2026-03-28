import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DownloadItem } from '../../models/download-item.model';

@Component({
  selector: 'app-download-controls',
  imports: [],
  templateUrl: './download-controls.component.html',
  styleUrl: './download-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadControlsComponent {
  images = input.required<DownloadItem[]>();
  downloadAll = output<void>();
  reset = output<void>();
  downloadSingle = output<DownloadItem>();

  onDownloadAll(): void {
    this.downloadAll.emit();
  }

  onReset(): void {
    this.reset.emit();
  }

  onDownloadSingle(image: DownloadItem): void {
    this.downloadSingle.emit(image);
  }
}
