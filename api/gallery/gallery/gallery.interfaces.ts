export interface GalleryRequestParams {
  page: number;
  limit: number;
  filter: string | boolean;
  user: string;
}

export interface GalleryResponse {
  objects: Array<string>;
  page: number;
  total: number;
}
