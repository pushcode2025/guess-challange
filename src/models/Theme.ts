export interface Theme {
  id: string;
  name: string;
  slug: string;
  image:string;
  description?: Record<string, string> | null; 
  icon:string,
  created_at?: string;
  updated_at?: string;
  is_coming_soon : boolean
  
}