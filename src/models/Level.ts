export interface Level {
  id: string;
  theme_id?: number | null;
  name: string;
  categories_count: number;
  time_per_attempt: number;
  questions_limit:number | null
  sub_categories_limit? : number | null
  level_time:number;
  hint:string;
  created_at?: string;
  updated_at?: string;
}
