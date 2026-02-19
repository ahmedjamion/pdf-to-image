export type DownloadStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface DownloadItem {
  id: string;
  pageNumber: number;
  blob: Blob;
  filename: string;
  status: DownloadStatus;
  error?: string;
}

export interface DownloadProgress {
  downloaded: number;
  total: number;
  percent: number;
}

export interface ZipDownloadOptions {
  filename: string;
  images: DownloadItem[];
}
