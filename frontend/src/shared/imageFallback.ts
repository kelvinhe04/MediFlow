import type { SyntheticEvent } from "react";

export const IMAGE_PLACEHOLDER_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3C/svg%3E";

export function withImagePlaceholder(src?: string | null) {
  return src && src.trim().length > 0 ? src : IMAGE_PLACEHOLDER_DATA_URI;
}

export function handleImageFallback(event: SyntheticEvent<HTMLImageElement, Event>) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = IMAGE_PLACEHOLDER_DATA_URI;
}
