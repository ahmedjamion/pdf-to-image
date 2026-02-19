export type ImageFormat = 'png' | 'jpeg' | 'webp';

export interface ConversionOptions {
  format: ImageFormat;
  quality: number;
  scale: number;
}

export const DEFAULT_CONVERSION_OPTIONS: ConversionOptions = {
  format: 'png',
  quality: 0.92,
  scale: 2,
};

export interface ConversionProgress {
  current: number;
  total: number;
  percent: number;
}
