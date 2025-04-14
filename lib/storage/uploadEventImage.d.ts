declare module '@/lib/storage/uploadEventImage' {
  export class StorageError extends Error {
    constructor(message: string, code?: string);
    code?: string;
  }

  export function uploadEventImage(file: File, eventId: string): Promise<string>;
}
