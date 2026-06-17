export interface User {
  id: string;          
  username: string;
  password: string;
  birthdate: string;   
  role: 'admin' | 'user';
}