import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly apiUrl = 'http://localhost:3000/api/users';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  // Recupera la lista di tutti gli utenti
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Recupera un utente per ID 
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  // Aggiorna un utente parzialmente 
  updateUser(userId: string, body: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, body);
  }
  // Elimina un utente 
  deleteUser(userId: string): Observable<{ success: boolean; deleted: User }> {
    return this.http.delete<{ success: boolean; deleted: User }>(`${this.apiUrl}/${userId}`);
  }
}