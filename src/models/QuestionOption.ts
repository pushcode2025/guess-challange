export interface QuestionOption {
  id: string;
  text: any;
  image: string | null;
  answer?: 'yes' | 'no' | 'unknown';
}