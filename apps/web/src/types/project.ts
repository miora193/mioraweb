export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiMedia {
  id: number;
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  } | null;
}

export interface Project {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  category?: string;
  client?: string;
  location?: string;
  year?: number;
  websiteUrl?: string;
  featured?: boolean;
  order?: number;
  cover?: StrapiMedia | null;
  gallery?: StrapiMedia[];
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}
