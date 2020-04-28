export type UploadValue = UploadFile[];

export interface UploadFile {
  readonly id: string;
  readonly url?: string;
}
