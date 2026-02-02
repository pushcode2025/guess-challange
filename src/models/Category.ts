export interface Category {
  id: string;
  theme_id: number;
  name: string;
  slug: string;
  description?: Record<string, string> | string | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}
