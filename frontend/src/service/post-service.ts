import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewPost, Post } from '../model/post.model';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly apiUrl = 'http://localhost:3000/api/posts';
  private selectedPostId: string | null = null;
  private coverImage: string | null = null;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  // Recupera tutti i post 
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // Recupera un singolo post tramite UUID 
  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // Recupera gli ultimi 3 post 
  getLatestPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts => posts.slice(-3))
    );
  }

  // Crea un nuovo post  
  createPost(post: NewPost): Observable<Post> {
  return this.http.post<Post>(this.apiUrl, post);
  }

  // Elimina un post tramite UUID (admin) 
  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Aggiorna un post parzialmente (admin) 
  patchPost(id: string, body: Partial<Post>): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}`, body);
  }

  uploadCoverImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('coverImage', file, file.name);
    return this.http.post<{ success: boolean, filePath: string }>(`http://localhost:3000/api/upload`, formData).pipe(
      map(response => response.filePath)
    );
  }

  // Gestione interna dell'ID post selezionato
  setSelectedPostId(id: string): void {
    this.selectedPostId = id;
  }
  getSelectedPostId(): string | null {
    return this.selectedPostId;
  }
  // Gestione dell'immagine di copertura
  setCoverImage(image: string | null): void {
    this.coverImage = image;
  }

  getCoverImage(): string | null {
    return this.coverImage;
  }
  deleteCoverImage(filename: string): Observable<void> {
    const url = `http://localhost:3000/api/uploads/${filename}`;
    return this.http.delete<void>(url);
  }
}