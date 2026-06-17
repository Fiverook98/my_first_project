export interface Post {
  id: string;         
  title: string;
  content: string;
  author?: string;    
  user_id?: string;   
  created_at: string; 
  coverImage?: string | null; 
  tags: string[];
}

export interface NewPost {
  title: string;
  content: string;
  user_id: string;
  author?: string;
  coverImage?: string | null; 
  tags: string[];
}
