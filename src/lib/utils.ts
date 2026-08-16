import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number | string | undefined): string {
  const num = Number(amount ?? 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);
}

const IMAGE_EXT_RE = /\.(avif|webp|png|jpe?g|gif|bmp|svgz?|ico|tif{1,2})(?:[?#].*)?$/i;

/**
 * Accepts only image URLs (or image-only storage references). Used to keep
 * the admin on image formats only — jpg/png/jpeg/webp/avif/gif/svg/bmp/
 * tiff/ico and the app's own /api/upload/file proxy paths. Rejects PDFs,
 * videos, archives and any other file type.
 */
export function isImageUrl(value: string | undefined | null): boolean {
  const raw = String(value ?? '').trim();
  if (!raw) return false;
  if (raw.startsWith('data:image/')) return true;
  if (raw.startsWith('/api/upload/file/')) return true;
  if (raw.startsWith('uploads/')) return true;
  if (raw.startsWith('/uploads/')) return true;
  if (/^https?:\/\//i.test(raw)) {
    return IMAGE_EXT_RE.test(raw);
  }
  return false;
}
