export interface ShutterstockSearchParameters {
  added_date?: string;
  added_date_end?: string;
  added_date_start?: string;
  aspect_ratio?: number;
  aspect_ratio_max?: number;
  aspect_ratio_min?: number;
  category?: string;
  color?: string;
  contributor?: string[];
  contributor_county?: string[];
  fields?: string;
  height_from?: number;
  height_to?: number;
  image_type?: 'photo' | 'illustration' | 'vector';
  keyword_safe_search?: boolean;
  language?: string;
  license?: string[];
  model?: string[];
  orientation?: string;
  page?: number;
  people_age?: string;
  people_ethnicity?: string[];
  people_gender?: 'male' | 'female' | 'both';
  people_model_released?: boolean;
  people_number?: number;
  per_page?: number;
  query?: string;
  region?: string;
  safe?: boolean;
  sort?: 'newest' | 'popular' | 'relevance' | 'random';
  spellcheck?: boolean;
  view?: 'minimal' | 'full';
  width_from?: number;
  width_to?: number;
  height?: number;
  width?: number;
}

export interface ShutterstockImageMeta {
  id: string;
  aspect?: number;
  contributor_id: string;
  description: string;
  image_type: string;
  media_type: string;
}

export interface ShutterstockImage extends ShutterstockImageMeta {
  url: string;
  user?: string;
}
