export interface Comment {
  id?: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at?: string;
  username?: string;
  like: boolean;
  replies?: Comment[];
  isReplyOpen?: boolean;
}