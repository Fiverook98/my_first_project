import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Comment } from '../model/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly apiUrl = 'http://localhost:3000/api';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  // Recupera tutti i commenti di un post 
  getAllComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  // Crea un nuovo commento associato a un post 
  createComment(postId: string, comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/posts/${postId}/comments`, comment);
  }

  // Restituisce gli ultimi 3 commenti (per anteprima) 
  getLastComments(postId: string): Observable<Comment[]> {
    return this.getAllComments(postId).pipe(
      map(comments => comments.slice(-3))
    );
  } 

  // Elimina un commento: solo admin 
  deleteComment(postId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${postId}/comments/${commentId}`);
  }

  // Aggiunge una risposta a un commento
  addReply(postId: string, commentId: string, replyContent: string, userId: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/posts/${postId}/comments/${commentId}/replies`, { content: replyContent, user_id: userId });
  }

  // Recupera tutte le risposte di un commento 
  getReplies(postId: string, commentId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments/${commentId}/replies`);
  }
  // Elimina una risposta a un commento
  deleteReply(postId: string, commentId: string, replyId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${postId}/comments/${commentId}/replies/${replyId}`);
  }
}