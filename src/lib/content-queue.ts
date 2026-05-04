export type QueueAppId = "stackstreak" | "createcolor";
export type QueuePlatform = "Facebook" | "Instagram" | "Pinterest" | "Reddit";

export type ContentQueueItem = {
  id: string;
  app: QueueAppId;
  platform: QueuePlatform;
  themeKey: string;
  themeLabel: string;
  title: string;
  caption: string;
  headline: string;
  subheadline: string;
  imageUrl: string;
  reviewed: boolean;
  posted: boolean;
  createdAt: string;
  scheduledDay?: number;
};

export const CONTENT_QUEUE_STORAGE_KEY = "content_studio_queue_v1";

export function loadQueue(): ContentQueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONTENT_QUEUE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ContentQueueItem[];
  } catch {
    return [];
  }
}

export function saveQueue(items: ContentQueueItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONTENT_QUEUE_STORAGE_KEY, JSON.stringify(items));
}

export function upsertQueueItem(item: ContentQueueItem) {
  const items = loadQueue();
  const existingIndex = items.findIndex((x) => x.id === item.id);
  if (existingIndex >= 0) items[existingIndex] = item;
  else items.unshift(item);
  saveQueue(items);
  return items;
}

export function updateQueueItem(id: string, update: Partial<ContentQueueItem>) {
  const items = loadQueue().map((item) => (item.id === id ? { ...item, ...update } : item));
  saveQueue(items);
  return items;
}
