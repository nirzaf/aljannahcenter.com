/// <reference types="emdash/locals" />

import type {
  ContentBylineCredit,
  PortableTextBlock,
  TaxonomyTerm,
} from "emdash";

export interface CmsPage {
  id: string;
  slug: string | null;
  status: string;
  title: string;
  content?: PortableTextBlock[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  bylines?: ContentBylineCredit[];
  terms?: Record<string, TaxonomyTerm[]>;
}

export interface CmsPost extends CmsPage {
  featured_image?: {
    id: string;
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  excerpt?: string;
}

declare module "emdash" {
  interface EmDashCollections {
    pages: CmsPage;
    posts: CmsPost;
  }
}
